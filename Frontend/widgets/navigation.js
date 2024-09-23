// Navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../Screens/Dashboard';
import Chat from '../Screens/Chat';
import { Ionicons } from 'react-native-vector-icons'; // Import the icon library
import Reservations from '../Screens/Reservations';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home'; // Example icon name
          } else if (route.name === 'Chat') {
            iconName = 'chatbubbles'; // Example icon name
          } else if (route.name === 'Reservations') {
            iconName = 'calendar'; 
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green', // Color for active tab
        tabBarInactiveTintColor: 'gray', // Color for inactive tabs
        tabBarLabelStyle: { fontSize: 12 }, // Label styling
        tabBarStyle: { 
            backgroundColor: 'white', // Tab bar background color
            paddingBottom: 10, // Add padding at the bottom of the tab bar
            height: 60, // Adjust height to make room for margin
          },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{headerShown:false}}/>
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name='Reservations' component={Reservations}/>
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
