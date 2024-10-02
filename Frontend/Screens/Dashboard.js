import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { Button, Appbar } from "react-native-paper";
import { MachineContext } from "../MachineContext";
import Cards from "./Cardss"; // Ensure the import matches your file name
import { removeToken } from "../store";
import colors from "../constants/colors";

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
    // Iterate over all locations and count total, vacant, and occupied machines
    Object.values(machines).forEach((locationMachines) => {
      locationMachines.forEach((machine) => {
        total++;
        if (machine.status === "Vacant") vacant++;
        if (machine.status === "Occupied") occupied++;
        if (machine.status === "Preparing") preparing++;
      });
    });

    // Update the state with the calculated data
    setData({ total, vacant, occupied, preparing });
  }, [machines]); // Add machines as a dependency so that this effect runs when machines change

  // Prepare the entries, sort by the number of vacant machines, then map
  const sortedEntries = Object.entries(machines)
    .map(([location, locationData]) => {
      const vacantCount = locationData.filter(
        (machine) => machine.status === "Vacant"
      ).length;
      return { location, locationData, vacantCount };
    })
    .sort((a, b) => b.vacantCount - a.vacantCount); // Sort in descending order

  const handleLogout = () => {
    removeToken();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.areaview}>
      {/* AppBar with Logout Button */}
      <Appbar.Header style={styles.appbars}>
        <Appbar.Content
          title="Dashboard"
          titleStyle={{ color: colors.white }}
        />
        <Appbar.Action
          icon="logout"
          onPress={handleLogout}
          color={colors.white}
        />
      </Appbar.Header>

      <View style={styles.container}>
        {/* Summary Boxes */}
        <View style={styles.box}>
          <View
            style={[
              styles.boxeinside,
              {
                backgroundColor: "#4B70F5",
                width: 75,
                height: 75,
              },
            ]}
          >
            <Text style={styles.texts}>Total</Text>
            <Text style={[styles.texts, styles.number]}>{data.total}</Text>
          </View>
          <View
            style={[
              styles.boxeinside,
              {
                backgroundColor: colors.green,
                width: 75,
                height: 75,
              },
            ]}
          >
            <Text style={styles.texts}>Vacant</Text>
            <Text style={[styles.texts, styles.number]}>{data.vacant}</Text>
          </View>
          <View
            style={[
              styles.boxeinside,
              {
                backgroundColor: "#E63946",
                width: 75,
                height: 75,
              },
            ]}
          >
            <Text style={styles.texts}>Occupied</Text>
            <Text style={[styles.texts, styles.number]}>{data.occupied}</Text>
          </View>
          <View
            style={[
              styles.boxeinside,
              {
                backgroundColor: "#ff9933",
                width: 75,
                height: 75,
              },
            ]}
          >
            <Text style={styles.texts}>Preparing</Text>
            <Text style={[styles.texts, styles.number]}>{data.preparing}</Text>
          </View>
        </View>

        {/* Button */}
        <View style={{ width: "100%" }}>
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => navigation.navigate("Form", machine)}
          >
            Book Appointment
          </Button>
        </View>

        {/* Scrollable Cards Section */}
        <ScrollView style={styles.cardsContainer}>
          {sortedEntries.map(({ location, locationData }) => (
            <TouchableHighlight
              key={location}
              onPress={() =>
                navigation.navigate("Location", { navigation, location })
              }
              underlayColor="#FFFFFF"
            >
              <Cards locationName={location} locationData={locationData} />
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  areaview: {
    flex: 1,
    backgroundColor: "dodgerblue",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    color: colors.white,
    gap: 15,
    padding: 10,
    width: "100%",
    backgroundColor: colors.white,
  },
  boxeinside: {
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  texts: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
  },
  box: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignItems: "flex-start",
  },
  number: {
    fontSize: 40,
    paddingTop: 0,
  },
  button: {
    backgroundColor: "#22895D",
    color: colors.white,
    width: "100%",
    padding: 10,
    fontSize: 18,
  },
  cardsContainer: {
    width: "100%",
    flexGrow: 1, // Ensure the container grows to fit its content
  },
  appbars: {
    backgroundColor: colors.darkgreen,
    color: colors.white,
  },
});

export default Dashboard;
