import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage from "react-native-flash-message"; // Import FlashMessage

import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/CartScreen";
import SearchScreen from "./screens/SearchScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigation
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = "home";
          } else if (route.name === "CartTab") {
            iconName = "shopping-cart";
          } else if (route.name === "SearchTab") {
            iconName = "search";
          } else if (route.name === "ProfileTab") {
            iconName = "person";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#8c8a88",
        tabBarStyle: { display: "flex" },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{ title: "Cart" }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ title: "Search" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator to include LoginScreen and ProductDetailScreen
function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StackMain"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Register" }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailScreen}
        options={{ title: "Back to Category" }}
      />
    </Stack.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check user token
  const checkUserToken = async () => {
    const token = await AsyncStorage.getItem("usertoken");

    if (token && token != "") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    setIsLoggedIn(!!token); // Set isLoggedIn based on token presence
  };

  useEffect(() => {
    // Check user token on initial load
    checkUserToken();
  }, []);

  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={
            {
              // You can put more common drawer options here
            }
          }
          // This will check the user login status whenever the drawer opens
          onDrawerOpen={checkUserToken}
        >
          <Drawer.Screen name="Nivsjewels" component={MainStack} />
          {isLoggedIn && ( // Conditionally show the Change Password option
            <Drawer.Screen
              name="Change Password"
              component={ChangePasswordScreen}
            />
          )}
        </Drawer.Navigator>
      </NavigationContainer>

      {/* FlashMessage Component for Global Usage */}
      <FlashMessage position="bottom" />
    </>
  );
}

export default App;
