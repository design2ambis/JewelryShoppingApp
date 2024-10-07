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
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import FlashMessage from "react-native-flash-message"; // Import FlashMessage

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [usertoken, setUsertoken] = useState(null);
  const [isLoginForm, setIsLoginForm] = useState(true); // State to toggle between login and register forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Function to fetch user data
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
        showMessage({
          message: "Error",
          description: "Failed to load user data.",
          type: "danger",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to handle user login
  const handleLogin = async () => {
    if (!email || !password) {
      showMessage({
        message: "Input Error",
        description: "Please fill in both email and password.",
        type: "danger",
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
        await AsyncStorage.setItem("userid", data.userid);
        await AsyncStorage.setItem("username", data.username);
        await AsyncStorage.setItem("useremail", data.useremail);
        await AsyncStorage.setItem("userphone", data.userphone);
        await AsyncStorage.setItem("usertoken", data.usertoken);

        showMessage({
          message: "Success",
          description: `Welcome Back ${data.username}`,
          type: "success",
        });

        // Reload user data after successful login
        fetchUserData();
      } else {
        showMessage({
          message: data.msg || "Login failed",
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

  // Function to handle user registration
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      showMessage({
        message: "Input Error",
        description: "Please fill in all fields.",
        type: "danger",
      });
      return;
    }

    if (password !== confirmPassword) {
      showMessage({
        message: "Password Mismatch",
        description: "Passwords do not match.",
        type: "danger",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://nivsjewels.com/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === true) {
        showMessage({
          message: "Registration Successful",
          description: "You can now login.",
          type: "success",
        });

        setIsLoginForm(true); // Switch to the login form
      } else {
        showMessage({
          message: data.msg || "Registration failed",
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

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "userid",
        "username",
        "useremail",
        "userphone",
        "usertoken",
      ]);
      setUsertoken(null);
      setUserData({ username: "", email: "", phone: "" });
      showMessage({
        message: "Logout Successful",
        description: "You have been logged out.",
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: "Logout Error",
        description: "Failed to log out.",
        type: "danger",
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!usertoken) {
    return (
      <LinearGradient colors={["#f2e6d7", "#d9b98a"]} style={styles.gradient}>
        <View style={styles.container}>
          <Image
            source={{ uri: "https://nivsjewels.com/assets/images/logo.png" }}
            style={styles.logo}
          />
          {isLoginForm ? (
            <View>
              <Text style={styles.title}>Login</Text>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
                autoComplete="email"
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={handleLogin}
                style={[styles.button, styles.loginButton]}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <Text style={styles.registerText}>
                Don't have an account?
                <Text
                  style={styles.registerhere}
                  onPress={() => setIsLoginForm(false)} // Switch to register form
                >
                  {" "}
                  Register here
                </Text>
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>Register</Text>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
                autoComplete="email"
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
              />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                secureTextEntry
                onChangeText={(text) => setConfirmPassword(text)}
                style={styles.input}
              />
              <TouchableOpacity onPress={handleRegister} style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
              <Text style={styles.registerText}>
                Already have an account?
                <Text
                  style={styles.registerhere}
                  onPress={() => setIsLoginForm(true)} // Switch to login form
                >
                  {" "}
                  Login here
                </Text>
              </Text>
            </View>
          )}
        </View>
        <FlashMessage position="bottom" />
      </LinearGradient>
    );
  }

  // Render user profile if logged in
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        style={styles.input}
        value={userData.username}
        editable={false}
      />
      <TextInput style={styles.input} value={userData.email} editable={false} />
      <TextInput style={styles.input} value={userData.phone} editable={false} />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout} // Call handleLogout on press
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <FlashMessage position="bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20, backgroundColor: "#f0f2f5" },
  logo: { width: 80, height: 80, alignSelf: "center", marginBottom: 30 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#333" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15, // Increase padding for better touch target
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  loginButton: {
    marginTop: 20, // Adjust this value to move it slightly lower
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerText: { textAlign: "center", marginTop: 20, color: "#000" },
  registerhere: { color: "#007BFF" },
  loadingContainer: {
    // New style for loading spinner
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5", // Optional: Background color while loading
  },
});
