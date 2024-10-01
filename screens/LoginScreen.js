import React, { useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await fetch("https://myendpoint.com/api/signin", {
        // Replace with your actual API endpoint
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      // Assuming the API returns a token or user info on success
      Alert.alert(data.msg, data.text);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert(data.msg, data.text);
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
          Don't have an account? Register here
        </Text>
      </View>
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
    color: "#885b17", // Gold or brown color for elegance
  },
  buttonLabel: {
    color: "#fff", // Text color for the button
  },
});
