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

const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
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
    setSelectedSubcategory(subName);
    fetchProducts(catName, subName);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleSubcategoryPress(item.cat_name, item.sub_name)}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.sub_name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text>{item.no}</Text>
      <Text>Weight: {item.weight}</Text>
      {/* Add "Add to Cart" button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
      {loadingProducts && <ActivityIndicator size="large" color="#0000ff" />}
      {products.length > 0 && !loadingProducts && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          style={styles.productList}
          numColumns={2} // Set to 2 for grid layout
        />
      )}
      {selectedSubcategory && !loadingProducts && (
        <Text style={styles.selectedSubcategory}>
          Selected Subcategory: {selectedSubcategory}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  categoryItem: {
    marginRight: 12,
    alignItems: "center",
  },
  categoryImage: {
    width: 20,
    height: 20,
  },
  categoryName: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 12,
  },
  productList: {
    marginTop: 16,
  },
  productItem: {
    flex: 1,
    marginBottom: 12,
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 4, // Margin between items
  },
  productImage: {
    width: 100,
    height: 100,
  },
  selectedSubcategory: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
