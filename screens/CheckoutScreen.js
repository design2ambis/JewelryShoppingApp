import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function CheckoutScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setUsertoken] = useState(null);

  // User input states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [townCity, setCity] = useState("");
  const [stateCountry, setCountry] = useState("");
  const [zipcode, setZip] = useState("");
  const [order_confirmation, Setorder_confirmation] = useState("");
  const [save, setsave] = useState(1);

  // Fetch cart data from API
  const fetchCartData = async () => {
    const token = await AsyncStorage.getItem("usertoken");

    if (token && token !== "") {
      setUsertoken(token);
      try {
        const response = await fetch(
          `https://nivsjewels.com/api/select?get_cart&token=${token}`
        );
        const data = await response.json();

        if (data.status === 200 && data.data.length > 0) {
          setCartItems(data.data);
        } else {
          Alert.alert("Error", "Your Cart is Empty.");
          navigation.goBack();
        }
      } catch (err) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "User token not found.");
      setLoading(false);
    }
  };

  // Fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCartData();
    }, [])
  );

  // Handle checkout and place order
  const handleCheckout = async () => {
    if (!token) {
      Alert.alert("Error", "You need to log in to proceed to checkout.");
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Error", "Your cart is empty.");
      return;
    }

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !townCity ||
      !stateCountry ||
      !zipcode
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Create an order object to send
    const orderData = {
      firstName,
      lastName,
      phone,
      address,
      townCity,
      stateCountry,
      zipcode,
      token,
      save,
      order_confirmation,
    };

    try {
      // Make the POST request to place the order
      const response = await fetch("https://nivsjewels.com/api/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData), // Convert order data to JSON string
      });

      const result = await response.json();

      if (response.ok && result.status === true) {
        Alert.alert("Success", "Your order has been placed.");
        setTimeout(() => {
          navigation.navigate("My Orders");
        }, 1500); // 1-second delay
      } else {
        Alert.alert(
          "Error",
          result.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Calculate total items, weight, and quantity
  const totalItems = cartItems.length;
  const totalWeight = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.capWgt),
    0
  );
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + parseInt(item.caQty),
    0
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Items: {totalItems}</Text>
        <Text style={styles.totalText}>
          Total Weight: {totalWeight.toFixed(2)} g
        </Text>
        <Text style={styles.totalText}>Total Quantity: {totalQuantity}</Text>
      </View>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Address"
        multiline={true}
        numberOfLines={4}
        value={address}
        onChangeText={setAddress}
        style={styles.inputAddress}
      />
      <TextInput
        placeholder="City"
        value={townCity}
        onChangeText={setCity}
        style={styles.input}
      />
      <TextInput
        placeholder="Country"
        value={stateCountry}
        onChangeText={setCountry}
        style={styles.input}
      />
      <TextInput
        placeholder="ZIP Code"
        value={zipcode}
        onChangeText={setZip}
        style={styles.input}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.ckbutton} onPress={handleCheckout}>
        <Text style={styles.ckbuttonText}>Place Order</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  totalContainer: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputAddress: {
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  ckbutton: {
    marginTop: 20,
    backgroundColor: "#6200ea", // Vibrant color
    paddingVertical: 15, // Adjust for vertical padding
    paddingHorizontal: 30, // Adjust for horizontal padding
    borderRadius: 25, // Rounded corners
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
    elevation: 3, // Shadow effect on Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Offset for shadow (iOS)
    shadowOpacity: 0.3, // Shadow opacity (iOS)
    shadowRadius: 3, // Shadow radius (iOS)
  },
  ckbuttonText: {
    color: "#fff", // White text color for contrast
    fontSize: 14, // Font size
    fontWeight: "bold", // Bold text
  },
});
