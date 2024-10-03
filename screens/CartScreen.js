import React, { useEffect, useState } from "react";
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

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usertoken, setUsertoken] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      const token = await AsyncStorage.getItem("usertoken");

      if (token) {
        setUsertoken(token);
        try {
          const response = await fetch(
            `https://nivsjewels.com/api/select?get_cart&token=${token}`
          );
          const data = await response.json();

          if (data?.data) {
            setCartItems(data.data);
          } else {
            setError("Failed to fetch cart items.");
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

    fetchCartData();
  }, []);

  const removeFromCart = (caId) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from the cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            setCartItems((prevItems) =>
              prevItems.filter((item) => item.caId !== caId)
            );
          },
        },
      ]
    );
  };

  const increaseQty = (caId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.caId === caId ? { ...item, qty: item.caQty + 1 } : item
      )
    );
  };

  const decreaseQty = (caId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.caId === caId && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9b6f25" />
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
        <Button
          mode="contained"
          onPress={() => navigation.replace("Login")}
          style={styles.loginButton}
          labelStyle={styles.buttonLabel}
        >
          Go to Login
        </Button>
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

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Your Cart is Empty</Text>
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
                  onPress={() => decreaseQty(item.caId)}
                >
                  <MaterialIcons name="remove" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.caQty}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => increaseQty(item.caId)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f8f8" },
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
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
  emptyText: { color: "#999", fontSize: 18, textAlign: "center" },
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
});
