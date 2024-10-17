import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";

function CoinScreen() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch coin details from the API
  const fetchCoins = async () => {
    try {
      const response = await fetch(
        "https://chit.nivsjewels.com/action/api.php?get_coin_details"
      ); // Replace with your actual API endpoint
      const result = await response.json();
      if (result.code === 200) {
        setCoins(result.data); // Assuming data is an array of coins
      }
    } catch (error) {
      console.error("Error fetching coins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  // Render each coin in the grid
  const renderItem = ({ item }) => (
    <View style={styles.coinItem}>
      <Image source={{ uri: item.image }} style={styles.coinImage} />
      <Text style={styles.coinName}>{item.name}</Text>
      <Text style={styles.coinDetails}>Weight: {item.gram}g</Text>
      <Text style={styles.coinDetails}>Purity: {item.purity}</Text>
      <Text style={styles.coinPrice}>Price: ₹{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={coins}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // Two-column layout
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  coinItem: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    margin: 5,
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  coinImage: {
    width: 130,
    height: 130,
    marginBottom: 10,
    resizeMode: "contain",
  },
  coinName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  coinDetails: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  coinPrice: {
    fontSize: 16,
    color: "green",
    marginTop: 5,
    textAlign: "center",
  },
});

export default CoinScreen;
