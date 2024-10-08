import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderDetailsScreen = ({ route }) => {
  const { orderId } = route.params; // Get the orderId from navigation params
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch order details from the API
  const fetchOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("usertoken"); // Fetch token from AsyncStorage
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(
        `https://nivsjewels.com/api/select?get_order_details&id=${orderId}&token=${token}`
      );
      const result = await response.json();

      if (result.status === 200) {
        setOrderDetails(result.data); // Update order details
      } else {
        console.error("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading order details...</Text>
      </View>
    );
  }

  if (orderDetails.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No details available for this order.</Text>
      </View>
    );
  }

  const renderOrderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.img }} style={styles.productImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{item.proname}</Text>
          <Text style={styles.productDetails}>Weight: {item.wgt} g</Text>
          <Text style={styles.productDetails}>Quantity: {item.qty}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <FlatList
        data={orderDetails}
        renderItem={renderOrderItem}
        keyExtractor={(item, index) => index.toString()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  detailsContainer: {
    marginLeft: 15,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productDetails: {
    fontSize: 16,
    color: "#555",
  },
});

export default OrderDetailsScreen;
