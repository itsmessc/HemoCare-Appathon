import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Chart from "../widgets/chart";
import colors from "../constants/colors";
import Constants from "expo-constants";
const ip = Constants.expoConfig.extra.ip;
function Cards({ locationData, locationName }) {
  // chart here
  const total = locationData.length;
  console.log(locationData);

  const vacant = locationData.filter(
    (machine) => machine.status === "Vacant"
  ).length;
  const occupied = locationData.filter(
    (machine) => machine.status === "Occupied"
  ).length;
  const preparations = locationData.filter(
    (machine) => machine.status === "Preparing"
  ).length;
  const values = [preparations, vacant, occupied]; // Change the values here [Vacant - green, Preparing - blue, Occupied - red] instead of 3 1 4
  return (
    <View style={styles.card}>
      <Chart dimensions="100" values={values} />
      {/* Change the values here [Vacant - green, Preparing - blue, Occupied - red] instead of 3 1 4*/}
      <View style={styles.location}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{locationName}</Text>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={[styles.square, { backgroundColor: colors.green }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.normalText}>Vacant</Text>
            </View>
            <Text style={styles.normalText}>{values[1]}</Text>
          </View>
          <View style={styles.row}>
            <View style={[styles.square, { backgroundColor: colors.red }]} />
            <Text style={styles.normalText}>Occupied</Text>
            <Text style={styles.normalText}>{values[2]}</Text>
          </View>
          <View style={styles.row}>
            <View style={[styles.square, { backgroundColor: colors.prep }]} />
            <Text style={styles.normalText}>Preparing</Text>
            <Text style={styles.normalText}>{values[0]}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 140,
    width: "103%",
    backgroundColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 10,
    // Shadow properties for iOS
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Offset of the shadow
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 4, // Blur radius of the shadow
    // Elevation for Android
    elevation: 5, // Elevation to create shadow effect
  },
  location: {
    flexDirection: "column",
    alignItems: "flex-start",
    // backgroundColor: "#E1E1E1",
    justifyContent: "flex-start",
    borderRadius: 15,
    padding: 20,
    gap: 10,
    // paddingBottom: 10,
    paddingTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // Space between rows
  },
  square: {
    width: 10,
    height: 10,
    marginRight: 10, // Space between the square and text
  },
  normalText: {
    marginRight: 10, // Space between text elements
  },
});

export default Cards;
