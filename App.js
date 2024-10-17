import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage from "react-native-flash-message"; // Import FlashMessage
import { useWindowDimensions } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import CoinScreen from "./screens/CoinScreen";
import CartScreen from "./screens/CartScreen";
import SearchScreen from "./screens/SearchScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import OrdersScreen from "./screens/OrdersScreen";
import OrderDetailsScreen from "./screens/OrderDetailsScreen";
import CheckoutScreen from "./screens/CheckoutScreen";

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
          } else if (route.name === "CoinTab") {
            iconName = "savings";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#a8a7a7",
        tabBarStyle: { display: "flex" },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="CoinTab"
        component={CoinScreen}
        options={{ title: "Coins" }}
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
        name="ProductDetails"
        component={ProductDetailScreen}
        options={{ title: "Back to Category" }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: "Back to Cart" }}
      />
    </Stack.Navigator>
  );
}

// Orders Stack Navigator
function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: "My Orders" }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: "Order Details" }}
      />
    </Stack.Navigator>
  );
}

function App() {
  const dimensions = useWindowDimensions();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check user token
  const checkUserToken = async () => {
    const token = await AsyncStorage.getItem("usertoken");
    if (token && token != "") {
      setIsLoggedIn(true); // Update login state
    } else {
      setIsLoggedIn(false); // Update login state
    }
  };

  useEffect(() => {
    // Check user token on initial load
    checkUserToken();
  }, []);

  const handleDrawerOpen = async () => {
    await checkUserToken(); // Check user token every time drawer opens
  };

  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            drawerType: dimensions.width >= 768 ? "permanent" : "front",
          }}
          onDrawerOpen={handleDrawerOpen} // Trigger check on drawer open
        >
          <Drawer.Screen name="Nivsjewels" component={MainStack} />
          {isLoggedIn && ( // Conditionally show extra screens when logged in
            <>
              <Drawer.Screen
                name="Change Password"
                component={ChangePasswordScreen}
              />
              <Drawer.Screen name="My Orders" component={OrdersStack} />
            </>
          )}
        </Drawer.Navigator>
      </NavigationContainer>

      {/* FlashMessage Component for Global Usage */}
      <FlashMessage position="bottom" />
    </>
  );
}

export default App;
