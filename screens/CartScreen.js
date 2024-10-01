import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      const usertoken = AsyncStorage.getItem("usertoken");

      if (usertoken && usertoken != "") {
        try {
          const response = await fetch(
            `https://nivsjewels.com/api/select?get_cart&token=${usertoken}`
          );
          const data = await response.json();
          setCartItems(data.data); // Adjust this based on the structure of the response
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
      }
    };

    fetchCartData();
  }, []);

  const removeFromCart = (caId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.caId !== caId));
  };

  const increaseQty = (caId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.caId === caId ? { ...item, qty: item.qty + 1 } : item
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
                  <Text style={styles.qtyButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.caQty}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => increaseQty(item.caId)}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.caId)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  itemImage: {
    width: 100, // Increased image size
    height: 100, // Increased image size
    borderRadius: 10,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemWeight: {
    color: "#777",
    marginVertical: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  qtyButton: {
    backgroundColor: "#000", // Black button color
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 2, // Add a shadow effect for depth
  },
  qtyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  qtyText: {
    color: "#4a4849",
    fontSize: 20, // Increased font size for better visibility
    fontWeight: "semibold", // Increased font weight for better visibility
    marginHorizontal: 10,
  },
  removeButton: {
    backgroundColor: "#ff6f61", // Updated button color (light red)
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 8,
    elevation: 2,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
  },
});
