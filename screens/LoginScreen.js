import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await fetch("https://nivsjewels.com/api/signin", {
        // Replace with your actual API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      // Show success message
      if (data.status === true) {
        showMessage({
          message: `Success`,
          description: `Welcome Back ${data.name}`,
          type: "success",
          backgroundColor: "#4caf50", // Success color
          color: "#fff", // Text color
        });
        setTimeout(() => {
          navigation.navigate("Home");
        }, 2000);
      } else {
        showMessage({
          message: data.msg,
          description: data.text,
          type: "danger",
          backgroundColor: "#FF0505", // Success color
          color: "#fff", // Text color
        });
      }
    } catch (error) {
      // Show error message
      showMessage({
        message: "Error",
        description: error.message,
        type: "danger",
        backgroundColor: "#f44336", // Error color
        color: "#fff", // Text color
      });
    }
  };

  return (
    <LinearGradient colors={["#f2e6d7", "#d9b98a"]} style={styles.gradient}>
      <View style={styles.container}>
        <Image
          source={{ uri: "https://nivsjewels.com/assets/images/logo.png" }} // Replace with your logo URL
          style={styles.logo}
        />
        <Title style={styles.title}>Login</Title>
        <TextInput
          label="Email"
          value={email}
          mode="flat"
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          mode="flat"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />
        <Button
          mode="elevated"
          onPress={handleLogin} // Call handleLogin on press
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Login
        </Button>
        <Text
          style={styles.registerText}
          onPress={() => navigation.navigate("Register")}
        >
          Don't have an account?
          <Text style={styles.registerhere}> Register here</Text>
        </Text>
      </View>
      <FlashMessage position="top" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 30,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: "#6b4f3c", // Gold or brown color for elegance
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#ffffff99", // Light transparent background
  },
  button: {
    marginVertical: 25,
    backgroundColor: "#9b6f25",
    padding: 6,
    borderRadius: 5,
    width: "auto",
  },
  registerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#000", // Gold or brown color for elegance
  },
  buttonLabel: {
    color: "#fff", // Text color for the button
  },
  registerhere: {
    color: "#9b6f25",
  },
});
