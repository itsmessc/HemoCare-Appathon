import { React, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "./Screens/Dashboard";
import LandingPage from "./Screens/LandingPage";
import Form from "./Screens/Form";
// import io from "socket.io-client";
import { MachineProvider } from "./MachineContext";
import Location from "./Screens/Location";
import BottomTabNavigator from "./widgets/navigation";
import Login from "./Screens/Login";
import Register from "./Screens/Signup";
import { OneSignal } from "react-native-onesignal";
import axios from "axios";
import { ip } from "./constants/variables.js";
const Stack = createNativeStackNavigator();

export default function App({}) {
  useEffect(() => {
    // OneSignal Initialization
    OneSignal.initialize("25d4fd08-24db-4109-8f17-440d23a9a89e"); // Replace with your OneSignal App ID

    // Request permission for notifications
    OneSignal.Notifications.requestPermission(true);

    // Fetch Player ID when the device is registered
    OneSignal.User.getOnesignalId().then((userId) => {
      if (userId) {
        setPlayerId(userId);
        console.log("OneSignal Player ID:", userId);
      } else {
        console.error("User ID not found. User may not be subscribed.");
      }
    });
    // axios.post(`${ip}/send-to-all`);

    // Handle notification opened
    OneSignal.Notifications.addEventListener("click", (event) => {
      console.log("OneSignal: notification clicked:", event);
    });
  }, []);

  return (
    <MachineProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tabs"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Form" component={Form} />
          <Stack.Screen name="Location" component={Location} />
        </Stack.Navigator>
      </NavigationContainer>
    </MachineProvider>
  );
}
