import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import MachineOcc from "../widgets/machoccupied"; // Ensure the correct import path
import MachineVacant from "../widgets/machvacant"; // Ensure the correct import path
import { MachineContext } from "../MachineContext";

const Location = ({ navigation }) => {
  const route = useRoute(); // Get route object
  const location = route.params.location; // Extract locationData from route params

  const { machines, appointment } = useContext(MachineContext);
  const [data, setData] = useState([]);
  useLayoutEffect(() => {
    const headerTitle = `Location: ${location}`;

    navigation.setOptions({
      title: headerTitle,
      headerStyle: {
        backgroundColor: "#4B70F5", // Example color, adjust as needed
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation, location]);
  useEffect(() => {
    if (machines && location) {
      let locationData = machines[location] || []; // Set data based on location

      // Sort data with null end_time first, then by end_time in ascending order
      locationData.sort((a, b) => {
        if (a.end_time === null && b.end_time !== null) {
          return -1; // a should come before b
        }
        if (a.end_time !== null && b.end_time === null) {
          return 1; // b should come before a
        }
        // If both are null or both are not null, sort by end_time in ascending order
        return (a.end_time || "").localeCompare(b.end_time || "");
      });

      setData(locationData);
    }
  }, [machines, location]);

  // Separate the machines into occupied and vacant
  const vacantMachines = data.filter((machine) => machine.status === "Vacant");
  const occupiedMachines = data.filter(
    (machine) => machine.status === "Occupied"
  );

  const total = data.length;
  const vacant = vacantMachines.length;
  const occupied = occupiedMachines.length;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.box}>
          <View
            style={[
              styles.boxeinside,
              {
                backgroundColor: "#4B70F5",
                width: 100,
                height: 100,
              },
            ]}
          >
            <Text style={styles.texts}>Total</Text>
            <Text style={[styles.texts, styles.number]}>{total}</Text>
          </View>
          <View
            style={[
              styles.boxeinside,
              {
                backgroundColor: "#3E9837",
                width: 100,
                height: 100,
              },
            ]}
          >
            <Text style={styles.texts}>Vacant</Text>
            <Text style={[styles.texts, styles.number]}>{vacant}</Text>
          </View>
          <View
            style={[
              styles.boxeinside,
              {
                backgroundColor: "#E63946",
                width: 100,
                height: 100,
              },
            ]}
          >
            <Text style={styles.texts}>Occupied</Text>
            <Text style={[styles.texts, styles.number]}>{occupied}</Text>
          </View>
        </View>
      </View>

      {/* Combine the two lists into one FlatList */}
      <FlatList
        data={data}
        keyExtractor={(item) => item._id} // Ensure each item has a unique ID
        renderItem={({ item }) =>
          item.status === "Occupied" ? (
            <MachineOcc
              machine={item}
              reservations={appointment.filter(
                (appointment) => appointment.machine_id === item._id
              )}
            />
          ) : (
            <MachineVacant
            navigation={navigation}
              machine={item}
              reservations={appointment.filter(
                (appointment) => appointment.machine_id === item._id
              )}
            />
          )
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#FFF", // Softer background color for better contrast
    padding: 0,
  },
  container: {
    backgroundColor: "#FFFFFF", // White background for content box
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  boxeinside: {
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  texts: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
  },
  box: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    alignItems: "flex-start",
  },
  number: {
    fontSize: 40,
    paddingTop: 0,
  },
  listContainer: {
    paddingBottom: 10, // Adjust as needed
  },
});

export default Location;
