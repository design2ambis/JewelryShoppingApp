import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image, // Import Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch token and orders from API
  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("usertoken");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(
        `https://nivsjewels.com/api/select?get_order&token=${token}`
      );
      const result = await response.json();

      if (result.status === 200) {
        setOrders(result.data);
      } else {
        // console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderContainer}
      onPress={() => navigation.navigate("OrderDetails", { orderId: item.id })}
    >
      <View style={styles.orderInfo}>
        <Text style={styles.orderNo}>Order No: {item.Orderno}</Text>
        <Text style={styles.orderStatus}>
          {item.OSta === "1" ? "Pending" : "Completed"}
        </Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderText}>Quantity: {item.Qty}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    // Check if there are no orders
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require("../assets/images/no-orders.png")} // Update the path to your image
          style={styles.emptyImage}
        />
        <Text style={styles.emptyText}>No Orders</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()} // Ensure the keyExtractor is a string
        renderItem={renderOrder}
        ListEmptyComponent={<Text>No orders available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  orderContainer: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderNo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: "600",
    color: "#008000",
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderText: {
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: 100, // Set your desired width
    height: 100, // Set your desired height
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default OrdersScreen;
