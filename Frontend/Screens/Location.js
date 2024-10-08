import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import MachineOcc from "../widgets/machoccupied"; // Ensure the correct import path
import MachineVacant from "../widgets/machvacant"; // Ensure the correct import path
import { MachineContext } from "../MachineContext";
import MachinePrep from "../widgets/machprep";
import colors from "../constants/colors";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install this package

const ip = Constants.expoConfig.extra.ip;

const Location = ({ navigation }) => {
  const route = useRoute(); // Get route object
  const location = route.params.location; // Extract locationData from route params

  const { machines, appointments } = useContext(MachineContext);
  const [data, setData] = useState([]);
  useLayoutEffect(() => {
    const headerTitle = `Location: ${location}`;

    navigation.setOptions({
      title: headerTitle,
      headerStyle: {
        backgroundColor: colors.teal, // Example color, adjust as needed
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
  const preparingMachines = data.filter((machine) => machine.status === "Preparing");

  const total = data.length;
  const vacant = vacantMachines.length;
  const occupied = occupiedMachines.length;
  const preparing = preparingMachines.length;
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
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
                <Text style={[styles.texts, styles.number]}>{total}</Text>
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
                <Text style={[styles.texts, styles.number]}>{vacant}</Text>
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
                  {occupied}
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
                  {preparing}
                </Text>
              </View>
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
              reservations={appointments.filter(
                (appointment) => appointment.machine_id === item._id
              )}
            />
          ) : (
            item.status === "Vacant" ?(
              <MachineVacant
                navigation={navigation}
                  machine={item}
                  reservations={appointments.filter(
                    (appointment) => appointment.machine_id === item._id
                  ).filter((app)=>app.type=='Reservation').filter((app)=>{
                    const today = new Date();
                    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
                    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
                    const appointmentDate = new Date(app.start_time);
                    return appointmentDate >= startOfDay && appointmentDate <= endOfDay;
                  })}
                />
            ):(
              <MachinePrep
              navigation={navigation}
              machine={item}
              reservations={appointments.filter(
                (appointment) => appointment.machine_id === item._id
              )}
              />
            )
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
    padding: 8,
    marginBottom: 0,
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
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 0,
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
});

export default Location;
