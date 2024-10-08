import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function CheckoutScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usertoken, setUsertoken] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");

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
          calculateTotalAmount(data.data);
        } else {
          Alert.alert("Error", "Your Cart is Empty.");
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

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCartData();
    }, [])
  );

  const calculateTotalAmount = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.capPrice * item.caQty,
      0
    );
    setTotalAmount(total);
  };

  const handleCheckout = () => {
    if (!usertoken) {
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
      !city ||
      !country ||
      !zip
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Handle checkout logic here, e.g., API call to process payment

    Alert.alert("Success", "Your order has been placed.");
    navigation.navigate("Home"); // Navigate to home or any other screen
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.caId.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.capImg }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.capName}</Text>
              <Text style={styles.itemWeight}>Weight: {item.capWgt} g</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.caQty}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Amount: ₹{totalAmount}</Text>
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
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <TextInput
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
        style={styles.input}
      />
      <TextInput
        placeholder="ZIP Code"
        value={zip}
        onChangeText={setZip}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button
        title="Proceed to Checkout"
        onPress={handleCheckout}
        color="#17A6A8"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f8f8" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: { width: 80, height: 80, borderRadius: 10, marginRight: 16 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  itemWeight: { fontSize: 14, color: "#666" },
  itemQuantity: { fontSize: 14, color: "#666" },
  totalContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  totalText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  listContainer: { paddingBottom: 16 },
});
