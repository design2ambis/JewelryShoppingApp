import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Make sure to install this package if you don't have it

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce the input query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Fetch products based on debounced query
  useEffect(() => {
    if (debouncedQuery) {
      fetchProducts(debouncedQuery);
    }
  }, [debouncedQuery]);

  // Fetch products from the server
  const fetchProducts = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://your-api-url.com/products?search=${searchQuery}`
      );
      const data = await response.json();
      setProducts(data.products); // Adjust according to your API response structure
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search icon press
  const handleSearch = () => {
    if (query) {
      fetchProducts(query);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for your favorite Jewelry</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Type here..."
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity onPress={handleSearch}>
          <MaterialIcons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {loading && <Text>Loading...</Text>}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()} // Adjust according to your data
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>{item.name}</Text> {/* Adjust according to your data */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginRight: 8,
  },
  productItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
