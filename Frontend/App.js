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

const Stack = createNativeStackNavigator();

export default function App({}) {
  return (
    <MachineProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
          <Stack.Screen name="Tabs" component={BottomTabNavigator} options={{headerShown:false}}/>
          <Stack.Screen name="Form" component={Form} />
          <Stack.Screen name="Location" component={Location} />
        </Stack.Navigator>
      </NavigationContainer>
    </MachineProvider>
  );
}
