import React, { useEffect, useState, useCallback } from "react";
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
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usertoken, setUsertoken] = useState(null);
  const [isCartEmpty, setIsCartEmpty] = useState(false);

  const fetchCartData = async () => {
    const token = await AsyncStorage.getItem("usertoken");

    if (token && token != "") {
      setUsertoken(token);
      try {
        const response = await fetch(
          `https://nivsjewels.com/api/select?get_cart&token=${token}`
        );
        const data = await response.json();

        if (data.status == 200 && data.data.length > 0) {
          setCartItems(data.data);
          setIsCartEmpty(false);
        } else {
          setIsCartEmpty(true);
          setError("Your Cart is Empty.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError("User token not found.");
      setLoading(false);
    }
  };

  // Use useFocusEffect to refetch cart data whenever the cart screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Start loading when screen is focused
      fetchCartData();
    }, [])
  );

  const updateCart = async (caId, qty, type) => {
    try {
      const response = await fetch(
        `https://nivsjewels.com/api/update?update_cart=&id=${caId}&qty=${qty}&type=${type}`
      );
      const data = await response.json();

      if (data.update_sta === true) {
        fetchCartData(); // Fetch new cart data after update
      } else {
        Alert.alert("Error", data.message || "Could not update cart.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const increaseQty = (caId, currentQty) => {
    updateCart(caId, currentQty, "add");
  };

  const decreaseQty = (caId, currentQty) => {
    if (currentQty > 1) {
      updateCart(caId, currentQty, "sub");
    } else {
      removeFromCart(caId);
    }
  };

  const removeFromCart = (caId) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from the cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => updateCart(caId, 0, "delete") },
      ]
    );
  };

  const handleCheckout = () => {
    // Navigate to the checkout screen
    navigation.navigate("Checkout"); // Replace with the actual name of your checkout screen
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!usertoken) {
    return (
      <View style={styles.noTokenContainer}>
        <Image
          source={require('../assets/images/5087579.png')}
          style={styles.noTokenImage}
        />
        <Text style={styles.noTokenText}>You are not logged in</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("ProfileTab")}
          style={styles.loginButton}
          labelStyle={styles.buttonLabel}
        >
          Go to Login
        </Button>
      </View>
    );
  }

  if (error && isCartEmpty) {
    return (
      <View style={styles.emptyCartContainer}>
        <Image
          source={require('../assets/images/emptycart.png')}
          style={styles.emptyCartImage}
        />
        <Text style={styles.emptyCartText}>Your Cart is Empty</Text>
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
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => decreaseQty(item.caId, item.caQty)}
                >
                  <MaterialIcons name="remove" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.caQty}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => increaseQty(item.caId, item.caQty)}
                >
                  <MaterialIcons name="add" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.caId)}
              >
                <MaterialIcons name="delete" size={24} color="#fff" />
                <Text style={styles.removeButtonText}> Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Proceed to Checkout Button */}
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
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
  noTokenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noTokenImage: { width: 200, height: 200, marginBottom: 20 },
  noTokenText: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  loginButton: { backgroundColor: "#17A6A8", padding: 6 },
  buttonLabel: { color: "#fff", fontSize: 16 },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartImage: { width: 200, height: 200, marginBottom: 20 },
  emptyCartText: { fontSize: 18, fontWeight: "bold", color: "#666" },
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  qtyButton: {
    padding: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 16 },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ff6666",
    borderRadius: 4,
    marginTop: 10,
  },
  removeButtonText: { color: "#fff", fontSize: 14, marginLeft: 5 },
  listContainer: { paddingBottom: 16 },
  checkoutButton: {
    backgroundColor: "#6200ea",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});