import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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
  const [editable, setEditable] = useState(false);

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

  const updateUserData = async () => {
    try {
      await AsyncStorage.setItem("useremail", userData.email);
      await AsyncStorage.setItem("userphone", userData.phone);

      showMessage({
        message: "Profile updated successfully!",
        type: "success",
        backgroundColor: "#007BFF",
        color: "#fff",
      });
      setEditable(false);
    } catch (err) {
      showMessage({
        message: "Error updating profile",
        description: err.message,
        type: "danger",
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    }
  };

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
                backgroundColor: "#007BFF",
                color: "#fff",
              });
              navigation.replace("Login");
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
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!usertoken) {
    return (
      <View style={styles.noTokenContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
          }}
          style={styles.noTokenImage}
        />
        <Text style={styles.noTokenText}>You are not logged in</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
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
      <TouchableOpacity
        style={styles.button}
        onPress={editable ? updateUserData : () => setEditable(true)}
      >
        <Text style={styles.buttonText}>
          {editable ? "Save Changes" : "Edit Profile"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f2f5" },
  noTokenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noTokenImage: { width: 150, height: 150, marginBottom: 20 },
  noTokenText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  errorText: { color: "#dc3545", fontSize: 16, textAlign: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#333" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1, // for Android
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
