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
    useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [noProductImage, setNoProductImage] = useState(false); // State for no product image

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

  const fetchProducts = async (cat, subcat, page = 1) => {
    if (loadingProducts) return;

    setLoadingProducts(true);
    setNoProductImage(false); // Reset no product image state
    try {
      const response = await fetch(
        `https://utsarvajewels.com/api/crud?get_product_details_overall&cat=${cat}&subcat=${subcat}&page=${page}&wgt=0&type=0&collection=0`
      );
      const data = await response.json();
      if (data.status.status === 200) {
        setProducts(data.data);
        setHasMoreProducts(data.data.length > 0);
      } else if (data.status.status === 400) {
        setProducts([]); // No products, clear product list
        setNoProductImage(true); // Show no product image
        setHasMoreProducts(false); // Disable pagination
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubcategoryPress = (catName, subName) => {
    setSelectedCategorySubcategory({ catName, subName });
    setProducts([]); // Reset products when category changes
    setCurrentPage(1); // Reset to page 1
    fetchProducts(catName, subName, 1); // Fetch initial products
  };

  const handleProductPress = (designNo) => {
    navigation.navigate("ProductDetails", { designNo });
  };

  const loadProducts = (page) => {
    if (selectedCategorySubcategory) {
      const { catName, subName } = selectedCategorySubcategory;
      fetchProducts(catName, subName, page);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || (!hasMoreProducts && page > currentPage)) return;
    setCurrentPage(page);
    loadProducts(page);
  };

  const renderCategoryItem = ({ item }) => {
    const isSelected =
      selectedCategorySubcategory?.catName === item.cat_name &&
      selectedCategorySubcategory?.subName === item.sub_name;

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

  const Pagination = ({ currentPage, onPageChange, hasMoreProducts }) => {
    if (products.length === 0) return null; // Hide pagination if no products

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.disabledButton,
          ]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationText}>{"<<<"}</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>{currentPage}</Text>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            !hasMoreProducts && styles.disabledButton,
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={!hasMoreProducts}
        >
          <Text style={styles.paginationText}>{">>>"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View style={styles.categoryContainer}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCategoryItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {loadingProducts && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}

          {noProductImage && (
            <View style={styles.noProductContainer}>
              <Image
                source={{
                  uri: "https://notebookstore.in/image/no-product-found.png",
                }}
                style={styles.noProductImage}
              />
              {/* <Text style={styles.noProductText}>No Products Found</Text> */}
            </View>
          )}

          {!noProductImage && products.length > 0 && !loadingProducts && (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderProductItem}
              style={styles.productList}
              numColumns={2}
            />
          )}

          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMoreProducts={hasMoreProducts}
          />
        </>
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
    backgroundColor: "#f0f0f0",
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  paginationButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  paginationText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noProductContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProductImage: {
    width: 400,
    height: 200,
    resizeMode: "contain",
  },
  noProductText: {
    fontSize: 18,
    color: "#555",
    marginTop: 10,
  },
});

export default HomeScreen;
