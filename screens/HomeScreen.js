import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategorySubcategory, setSelectedCategorySubcategory] =
    useState(null); // Corrected function name
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://utsarvajewels.com/api/crud?get_random_category_list_new"
      );
      const data = await response.json();
      if (data.option.status === 200) {
        setCategories(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const fetchProducts = async (cat, subcat) => {
    setLoadingProducts(true);
    try {
      const response = await fetch(
        `https://utsarvajewels.com/api/crud?get_product_details_overall&cat=${cat}&subcat=${subcat}&&page=1&&wgt=0&&type=0&&collection=0`
      );
      const data = await response.json();
      if (data.status.status === 200) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubcategoryPress = (catName, subName) => {
    setSelectedCategorySubcategory({ catName, subName }); // Set selected category and subcategory as an object
    fetchProducts(catName, subName);
  };

  const handleProductPress = (designNo) => {
    navigation.navigate("ProductDetails", { designNo });
  };

  const renderCategoryItem = ({ item }) => {
    const isSelected =
      selectedCategorySubcategory?.catName === item.cat_name && // Check if the category name matches
      selectedCategorySubcategory?.subName === item.sub_name; // Check if the subcategory name matches

    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && styles.selectedCategorySubcategory,
        ]}
        onPress={() => handleSubcategoryPress(item.cat_name, item.sub_name)}
      >
        <Text style={styles.categoryName}>
          {item.cat_name} {item.sub_name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductPress(item.no)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.no}</Text>
      <Text style={styles.productDetail}>Weight: {item.weight}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {loadingProducts && <ActivityIndicator size="large" color="#0000ff" />}
      {products.length > 0 && !loadingProducts && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          style={styles.productList}
          numColumns={2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  categoryContainer: {
    justifyContent: "center",
    marginBottom: 16,
  },
  categoryItem: {
    marginRight: 12,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  selectedCategorySubcategory: {
    borderColor: "#ffb400",
    borderWidth: 2,
    backgroundColor: "#f0f0f0", // Changed to a light gray color
  },
  categoryName: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
  },
  productList: {
    marginTop: 20,
  },
  productItem: {
    flex: 1,
    marginBottom: 12,
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  productDetail: {
    fontSize: 14,
    color: "#777",
  },
});

export default HomeScreen;
