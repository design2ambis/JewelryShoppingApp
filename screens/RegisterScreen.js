import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <LinearGradient colors={["#f2e6d7", "#d9b98a"]} style={styles.gradient}>
      <View style={styles.container}>
        <Image
          source={{ uri: "https://nivsjewels.com/assets/images/logo.png" }} // Replace with your logo URL
          style={styles.logo}
        />
        <Title style={styles.title}>Register</Title>
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
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          mode="flat"
          secureTextEntry
          onChangeText={(text) => setConfirmPassword(text)}
          style={styles.input}
        />
        <Button
          mode="elevated"
          onPress={() => navigation.navigate("Login")}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Register
        </Button>
        <Text
          style={styles.Logintext}
          onPress={() => navigation.navigate("Login")}
        >
          Already have an account? Login here
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
  Logintext: {
    textAlign: "center",
    marginTop: 20,
    color: "#885b17", // Gold or brown color for elegance
  },
  buttonLabel: {
    color: "#fff", // Text color for the button
  },
});
