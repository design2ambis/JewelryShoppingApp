import React, { useState } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import FlashMessage, { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage({
        message: "Input Error",
        description: "Please fill in both email and password.",
        type: "danger",
        backgroundColor: "#FF0505",
        color: "#fff",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://nivsjewels.com/api/signin", {
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

      if (data.status === true) {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem("userid", data.userid);
        await AsyncStorage.setItem("username", data.username);
        await AsyncStorage.setItem("useremail", data.useremail);
        await AsyncStorage.setItem("userphone", data.userphone);
        await AsyncStorage.setItem("usertoken", data.usertoken);

        // Show success message
        showMessage({
          message: "Success",
          description: `Welcome Back ${data.username}`,
          type: "success",
          backgroundColor: "#4caf50",
          color: "#fff",
        });

        // Navigate to HomeTab after a delay
        setTimeout(() => {
          navigation.navigate("StackMain"); // Navigate to HomeTab instead of Home
        }, 2000);
      } else {
        showMessage({
          message: data.msg || "Login failed",
          description: data.text || "An unknown error occurred.",
          type: "danger",
          backgroundColor: "#FF0505",
          color: "#fff",
        });
      }
    } catch (error) {
      showMessage({
        message: "Error",
        description: error.message,
        type: "danger",
        backgroundColor: "#f44336",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#f2e6d7", "#d9b98a"]} style={styles.gradient}>
      <View style={styles.container}>
        <Image
          source={{ uri: "https://nivsjewels.com/assets/images/logo.png" }}
          style={styles.logo}
        />
        <Title style={styles.title}>Login</Title>
        <TextInput
          label="Email"
          value={email}
          mode="flat"
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          autoComplete="email"
          keyboardType="email-address"
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
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : "Login"}
        </Button>
        <Text style={styles.registerText}>
          Don't have an account?
          <Text
            style={styles.registerhere}
            onPress={() => navigation.navigate("Register")}
          >
            {" "}
            Register here
          </Text>
        </Text>
      </View>
      <FlashMessage position="bottom" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  logo: { width: 80, height: 80, alignSelf: "center", marginBottom: 30 },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: "#6b4f3c",
  },
  input: { marginBottom: 15, backgroundColor: "#ffffff99" },
  button: {
    marginVertical: 25,
    backgroundColor: "#9b6f25",
    padding: 6,
    borderRadius: 5,
    width: "auto",
  },
  buttonLabel: { color: "#fff" },
  registerText: { textAlign: "center", marginTop: 20, color: "#000" },
  registerhere: { color: "#9b6f25" },
});
