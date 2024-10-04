import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/CartScreen";
import SearchScreen from "./screens/SearchScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen"; // Import ProductDetailScreen

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
      {/* Add the BottomTabs as the main screen */}
      <Stack.Screen
        name="StackMain"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      {/* Add the LoginScreen */}
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
      {/* Add the ProductDetailScreen */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailScreen}
        options={{ title: "Product Details" }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="DrawerMain" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
