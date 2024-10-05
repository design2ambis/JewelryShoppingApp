import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageViewer from "react-native-image-zoom-viewer";

const ProductDetailScreen = ({ route }) => {
  const { designNo } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [qty, setQty] = useState(1); // Initial quantity for the cart

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(
        `https://utsarvajewels.com/api/crud?get_product&designno=${designNo}`
      );
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    const token = await AsyncStorage.getItem("usertoken"); // Retrieve user token

    if (!token) {
      Alert.alert("Error", "User is not logged in.");
      return;
    }

    try {
      const response = await fetch("https://nivsjewels.com/api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          add_cart: "",
          pid: product.design_id,
          qty: qty,
          prono: product.design_no,
          prowgt: product.design_weight,
          proimg: product.design_image,
          token: token, // User token from AsyncStorage
        }),
      });


      const data = await response.json();

      if (data.status) {
        Alert.alert("Success", data.message);
      } else {
        Alert.alert("Error", "Failed to add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      {product && (
        <>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: product.design_image }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.productTitle}>
            Design No: {product.design_no}
          </Text>
          <Text style={styles.productDetail}>
            Weight: {product.design_weight}
          </Text>
          <Text style={styles.productDetail}>Size: {product.size}</Text>
          <Text style={styles.productDetail}>
            Category: {product.category_name}
          </Text>
          <Text style={styles.productDetail}>
            Subcategory: {product.sub_cat_name}
          </Text>

          <TouchableOpacity style={styles.addButton} onPress={addToCart}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          {/* Modal for Zoom Image */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <ImageViewer
                imageUrls={[{ url: product.design_image }]}
                onSwipeDown={() => setModalVisible(false)}
                enableSwipeDown
              />
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    height: 350,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  productTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  productDetail: {
    fontSize: 18,
    marginBottom: 5,
    color: "#555",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    transform: [{ translateX: -50 }],
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
