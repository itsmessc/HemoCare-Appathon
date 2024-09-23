import React from "react";
import Dashboard from "./Dashboard";
import { StyleSheet, Button } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MyAppBar from "../widgets/appbar";

function LandingPage({ navigation }) {
  return (
    <SafeAreaProvider>
      <MyAppBar title="Landing Page" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#22895D",
    color: "white",
    width: "110%",
    padding: 10,
    marginTop: 20,
    marginLeft: -15,
  },
});

export default LandingPage;
