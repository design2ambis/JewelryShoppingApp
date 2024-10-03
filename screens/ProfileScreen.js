import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { showMessage } from "react-native-flash-message";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usertoken, setUsertoken] = useState(null);
  const [editable, setEditable] = useState(false); // Toggle editable state

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem("usertoken");
      setUsertoken(token);

      if (token) {
        try {
          const storedUsername = await AsyncStorage.getItem("username");
          const storedEmail = await AsyncStorage.getItem("useremail");
          const storedPhone = await AsyncStorage.getItem("userphone");

          setUserData({
            username: storedUsername || "N/A",
            email: storedEmail || "N/A",
            phone: storedPhone || "N/A",
          });
        } catch (err) {
          setError("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("User token not found.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle user data update
  const updateUserData = async () => {
    try {
      // Here you would normally make an API call to update user data.
      // For demonstration, we will just save it locally
      await AsyncStorage.setItem("useremail", userData.email);
      await AsyncStorage.setItem("userphone", userData.phone);

      showMessage({
        message: "Profile updated successfully!",
        type: "success",
        backgroundColor: "#4caf50",
        color: "#fff",
      });
      setEditable(false); // Disable editing after saving
    } catch (err) {
      showMessage({
        message: "Error updating profile",
        description: err.message,
        type: "danger",
        backgroundColor: "#f44336",
        color: "#fff",
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              showMessage({
                message: "Logged out successfully.",
                type: "success",
                backgroundColor: "#4caf50",
                color: "#fff",
              });
              navigation.replace("Login"); // Navigate to your Login screen
            } catch (error) {
              console.error("Failed to clear AsyncStorage:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9b6f25" />
      </View>
    );
  }

  if (!usertoken) {
    return (
      <View style={styles.noTokenContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
          }} // Replace with your image URL
          style={styles.noTokenImage}
        />
        <Text style={styles.noTokenText}>You are not logged in</Text>
        <Button
          title="Go to Login"
          onPress={() => navigation.navigate("Login")} // Replace with your login screen route
          color="#17A6A8"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        style={styles.input}
        value={userData.username}
        editable={false}
      />
      <TextInput
        style={styles.input}
        value={userData.email}
        editable={editable}
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, email: text }))
        }
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={userData.phone}
        editable={editable}
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, phone: text }))
        }
        placeholder="Phone"
      />
      <Button
        title={editable ? "Save Changes" : "Edit Profile"}
        onPress={editable ? updateUserData : () => setEditable(true)}
      />
      <Button title="Logout" onPress={handleLogout} color="#ff6347" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  noTokenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noTokenImage: { width: 200, height: 200, marginBottom: 20 },
  noTokenText: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
});
