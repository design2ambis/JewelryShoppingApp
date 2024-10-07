import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { showMessage } from "react-native-flash-message";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showMessage({
        message: "Input Error",
        description: "Please fill in all fields.",
        type: "danger",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showMessage({
        message: "Password Mismatch",
        description: "New passwords do not match.",
        type: "danger",
      });
      return;
    }

    setLoading(true);
    try {
      const usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(
        "https://nivsjewels.com/api/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usertoken}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await response.json();

      if (data.status === true) {
        showMessage({
          message: "Success",
          description: "Password changed successfully.",
          type: "success",
        });
      } else {
        showMessage({
          message: data.msg || "Change password failed",
          description: data.text || "An unknown error occurred.",
          type: "danger",
        });
      }
    } catch (error) {
      showMessage({
        message: "Error",
        description: error.message,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/4992/4992489.png",
        }}
        style={styles.image}
      />
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        placeholder="Current Password"
        value={currentPassword}
        secureTextEntry
        onChangeText={setCurrentPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="New Password"
        value={newPassword}
        secureTextEntry
        onChangeText={setNewPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm New Password"
        value={confirmNewPassword}
        secureTextEntry
        onChangeText={setConfirmNewPassword}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleChangePassword}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Change Password</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#f0f2f5",
    alignItems: "center", // Center align items
  },
  image: {
    width: 80, // Set your desired width
    height: 80, // Set your desired height
    marginBottom: 20, // Space between image and title
    marginTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "400",
    marginBottom: 20,
    color: "#868686",
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    width: "100%", // Ensure inputs take the full width
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%", // Ensure button takes the full width
    marginTop: 210,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  backButton: {
    backgroundColor: "#f15050", // Bootstrap secondary color
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    width: "100%",
    margin: 10, // Space between buttons
  },
  backButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
