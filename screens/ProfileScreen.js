import React from "react";
import { View, Text, StyleSheet, Button, AsyncStorage } from "react-native";

export default function ProfileScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to clear AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Your Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
