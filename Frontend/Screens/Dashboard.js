import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import { Button, Appbar } from "react-native-paper";
import { MachineContext } from "../MachineContext";
import Cards from "./Cardss";
import { removeToken } from "../store";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install this package

import Constants from "expo-constants";
const ip = Constants.expoConfig.extra.ip;
function Dashboard({ navigation }) {
  const [data, setData] = useState({
    total: 0,
    vacant: 0,
    occupied: 0,
    preparing: 0,
  });
  const { machines } = useContext(MachineContext);
  const machine = "";

  useEffect(() => {
    let total = 0;
    let vacant = 0;
    let occupied = 0;
    let preparing = 0;

    Object.values(machines).forEach((locationMachines) => {
      locationMachines.forEach((machine) => {
        total++;
        if (machine.status === "Vacant") vacant++;
        if (machine.status === "Occupied") occupied++;
        if (machine.status === "Preparing") preparing++;
      });
    });

    setData({ total, vacant, occupied, preparing });
  }, [machines]);

  const sortedEntries = Object.entries(machines)
    .map(([location, locationData]) => {
      const vacantCount = locationData.filter(
        (machine) => machine.status === "Vacant"
      ).length;
      return { location, locationData, vacantCount };
    })
    .sort((a, b) => b.vacantCount - a.vacantCount);

  const handleLogout = () => {
    removeToken();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.areaview}>
      <Appbar.Header style={styles.appbars}>
        <Appbar.Action icon="home" color="#fff" />
        <Appbar.Content
          title="Dashboard"
          titleStyle={{
            color: colors.white,
            fontFamily: "sans-serif",
            fontWeight: "bold",
          }}
        />
        <Appbar.Action
          icon="logout"
          onPress={handleLogout}
          color={colors.white}
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent} // Use this style to center content
        style={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Summary Boxes - 2x2 Grid */}
          <View style={styles.gridContainer}>
            <View style={[styles.summaryBox, { backgroundColor: "#4B70F5" }]}>
              <Ionicons
                name="bar-chart"
                size={35}
                color="white"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.texts}>Total</Text>
                <Text style={[styles.texts, styles.number]}>{data.total}</Text>
              </View>
            </View>
            <View
              style={[styles.summaryBox, { backgroundColor: colors.green }]}
            >
              <Ionicons
                name="checkmark-circle"
                size={35}
                color="white"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.texts}>Vacant</Text>
                <Text style={[styles.texts, styles.number]}>{data.vacant}</Text>
              </View>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: "#E63946" }]}>
              <Ionicons
                name="alert-circle"
                size={35}
                color="white"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.texts}>Occupied</Text>
                <Text style={[styles.texts, styles.number]}>
                  {data.occupied}
                </Text>
              </View>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: "#ff8c00" }]}>
              <Ionicons
                name="time"
                size={35}
                color="white"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.texts}>Preparing</Text>
                <Text style={[styles.texts, styles.number]}>
                  {data.preparing}
                </Text>
              </View>
            </View>
          </View>
          {/* Book Appointment Button */}
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => navigation.navigate("Form", machine)}
          >
            Book Appointment
          </Button>
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => navigation.navigate("Patient")}
          >
            Add Patient
          </Button>
          {/* Scrollable Cards Section */}
          {sortedEntries.map(({ location, locationData }) => (
            <TouchableHighlight
              key={location}
              onPress={() =>
                navigation.navigate("Location", { navigation, location })
              }
              underlayColor={colors.background}
            >
              <Cards locationName={location} locationData={locationData} />
            </TouchableHighlight>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  areaview: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    flexGrow: 1, // Allow ScrollView to grow
    justifyContent: "center", // Center items vertically
    alignItems: "center", // Center items horizontally
    paddingBottom: 20, // Add some padding at the bottom if needed
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    width: "100%",
  },
  appbars: {
    backgroundColor: "#008080",
    color: colors.white,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 10,
    // gap: 10,
  },
  summaryBox: {
    flexDirection: "row",
    alignItems: "center", // Center items vertically
    padding: 15,
    borderRadius: 10,
    marginBottom: 13,
    width: "45%", // Adjust width as needed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
  textContainer: {
    flex: 1, // Make text container take the remaining space
  },
  texts: {
    color: colors.white,
    fontSize: 16, // Slightly smaller font
    fontWeight: "800",
    textAlign: "right",
  },
  number: {
    fontSize: 30, // Reduced number size
    marginTop: 5,
  },
  button: {
    backgroundColor: "#008080",
    width: "94%",
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  cardsContainer: {
    width: "100%",
  },
});

export default Dashboard;
