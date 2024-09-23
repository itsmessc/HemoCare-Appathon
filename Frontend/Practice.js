import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from "react-native";
// import { Button } from "react-native-web";

export default function Practice() {
  let a = 10;
  return (
    <View style={styles.container}>
      <Text numberOfLines={1} onPress={() => console.log("Pressed")}>
        Heyy Gandu
      </Text>
      <Image source={require("./assets/favicon.png")} />
      <TouchableWithoutFeedback onPress={() => console.log("Image Pressed")}>
        <Image
          fadeDuration={1000}
          source={{
            width: 200,
            height: 300,
            uri: "https://picsum.photos/200/300",
          }}
        />
      </TouchableWithoutFeedback>
      <TouchableOpacity onPress={() => console.log("Image Pressed")}>
        <Image
          fadeDuration={1000}
          source={{
            width: 200,
            height: 300,
            uri: "https://picsum.photos/200/300",
          }}
        />
      </TouchableOpacity>
      <Button
        title="Click Me"
        color={"orange"}
        onPress={() => console.log("Button Pressed")}
      />
      <Button
        title="Click Me"
        color={"red"}
        onPress={() => alert("Button Pressed")}
      />
      <Button
        title="Click Me"
        color={"purple"}
        onPress={() =>
          Alert.alert("My Title", "My Message", [
            { text: "Yes", onPress: () => console.log("Yes") },
            { text: "No", onPress: () => console.log("No") },
          ])
        }
      />
      <Button
        title="Prompt Me"
        color={"green"}
        onPress={() =>
          Alert.prompt("Title", "Message", (text) => console.log(text))
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
});

// import { React, useState, useEffect, useContext } from "react";
// import { Text, View, StyleSheet } from "react-native";
// // import { StatusBar } from "expo-status-bar";
// // import { Appbar } from "react-native-paper";
// // import { SafeAreaView } from "react-native-web";
// // import { ScrollView } from "react-native-gesture-handler";
// import { Button } from "react-native-paper";
// import { MachineContext } from "../MachineContext";
// import Cards from "./Cardss";
// import Form from "./Form";

// function Dashboard({ navigation }) {
//   const [data, setData] = useState({ total: 0, vacant: 0, occupied: 0 });
//   const { machines, setMachines } = useContext(MachineContext);
//   let total = 0;
//   let vacant = 0;
//   let occupied = 0;

//   // useEffect(() => {
//   //   // Fetch data from your hosted backend
//   //   fetch("http://192.168.210.144:7878/machine/getdetails") // Replace with your API endpoint
//   //     .then((response) => response.json())
//   //     .then((json) => {
//   //       console.log(json);
//   //       json.forEach((element) => {
//   //         total++;
//   //         if (element.status === "Vacant") vacant++;
//   //         if (element.status === "Occupied") occupied++;
//   //       });
//   //       setData({
//   //         total: total,
//   //         vacant: vacant,
//   //         occupied: occupied,
//   //       });
//   //     })
//   //     .catch((error) => console.error("Error fetching data:", error));
//   // }, []);

//   useEffect(() => {
//     let total = 0;
//     let vacant = 0;
//     let occupied = 0;

//     // Iterate over all locations and count total, vacant, and occupied machines
//     Object.values(machines).forEach((locationMachines) => {
//       locationMachines.forEach((machine) => {
//         total++;
//         if (machine.status === "Vacant") vacant++;
//         if (machine.status === "Occupied") occupied++;
//       });
//     });
//   }, []);
//   setData({
//     total: total,
//     vacant: vacant,
//     occupied: occupied,
//   });

//   return (
//     <View style={styles.areaview}>
//       {/* <Appbar.Header style={styles.appbars}>
//         <Appbar.Content title="Dashboard" />
//       </Appbar.Header> */}
//       <View style={styles.container}>
//         <View style={styles.box}>
//           <View
//             style={[
//               styles.boxeinside,
//               {
//                 backgroundColor: "#4B70F5",
//                 width: 100,
//                 height: 100,
//               },
//             ]}
//           >
//             <Text style={styles.texts}>Total</Text>
//             <Text style={[styles.texts, styles.number]}>{data.total}</Text>
//           </View>
//           <View
//             style={[
//               styles.boxeinside,
//               {
//                 backgroundColor: "#3E9837",
//                 width: 100,
//                 height: 100,
//               },
//             ]}
//           >
//             <Text style={styles.texts}>Vacant</Text>
//             <Text style={[styles.texts, styles.number]}>{data.vacant}</Text>
//           </View>
//           <View
//             style={[
//               styles.boxeinside,
//               {
//                 backgroundColor: "#E63946",
//                 width: 100,
//                 height: 100,
//               },
//             ]}
//           >
//             <Text style={styles.texts}>Occupied</Text>
//             <Text style={[styles.texts, styles.number]}>{data.occupied}</Text>
//           </View>
//         </View>

//         {/* Button  */}
//         <View style={{ width: "100%" }}>
//           <Button
//             style={styles.button}
//             mode="contained"
//             onPress={() => navigation.navigate("Form")}
//           >
//             Book Appointment
//           </Button>
//         </View>

//         {/* Progeress Circle  */}
//         <View style={{ width: "100%" }}>
//           <Cards />
//         </View>
//       </View>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   areaview: {
//     flex: 1,
//     backgroundColor: "dodgerblue",
//   },
//   appbars: {
//     backgroundColor: "#22895D",
//     width: "100%",
//     marginTop: -30,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#E1E1E1",
//     alignItems: "flex-start",
//     flexDirection: "column",
//     justifyContent: "flex-start",
//     color: "white",
//     gap: 15,
//     padding: 40,
//     width: "100%",
//   },
//   boxeinside: {
//     borderRadius: 10,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   texts: {
//     color: "white",
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     paddingTop: 10,
//   },
//   box: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 15,
//     alignItems: "flex-start",
//   },
//   number: {
//     fontSize: 40,
//     paddingTop: 0,
//   },
//   button: {
//     backgroundColor: "#22895D",
//     color: "white",
//     width: "100%",
//     padding: 10,
//     marginTop: 20,
//   },
// });

// export default Dashboard;
