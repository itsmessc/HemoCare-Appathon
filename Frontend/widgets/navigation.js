// Navigation/BottomTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../Screens/Dashboard";
import Chat from "../Screens/Chat";
import { Ionicons } from "react-native-vector-icons"; // Import the icon library
import Reservations from "../Screens/Reservations";
import colors from "../constants/colors";

import RepScreen from "../Screens/Report";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "home"; // Example icon name
          } else if (route.name === "Chat") {
            iconName = "chatbubbles"; // Example icon name
          } else if (route.name === "Reservations") {
            iconName = "calendar";
          } else if (route.name === "Report") {
            iconName = "document";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.teal, // Color for active tab
        tabBarInactiveTintColor: colors.darkgrey, // Color for inactive tabs
        tabBarLabelStyle: { fontSize: 12 }, // Label styling
        tabBarStyle: {
          backgroundColor: "white", // Tab bar background color
          paddingBottom: 10, // Add padding at the bottom of the tab bar
          height: 60, // Adjust height to make room for margin
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Reservations" component={Reservations} options={{ headerShown: false }} />
      <Tab.Screen name="Report" component={RepScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
