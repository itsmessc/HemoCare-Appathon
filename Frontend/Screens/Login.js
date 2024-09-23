import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert,Image } from "react-native";
import { Button } from "react-native-paper";
import axios from "axios"; // Ensure axios is imported
import colors from "../constants/colors";
import MyTextInput from "../widgets/textinput";
import { getToken, storeToken } from "../store";

function Login({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();
        if (token) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Tabs' }]
              });
        }
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };
    
    checkToken();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://192.168.138.144:7878/staff/login", {
        phone,
        password,
      });

      // Handle success
      if (response.status == 200) {
        Alert.alert("Login Successful", "You have logged in successfully");
        
        await storeToken(response.data.token);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }]
          });
        // Do any further navigation or state updates
      }
    } catch (error) {
      // Handle error
      console.error('Login failed:', error); // More detailed logging
      Alert.alert("Login Failed", "Invalid Phone Number or Password");
    }
  };

  return (
    <View style={styles.container}>
      
      <Image
        source={require("../assets/logo1.png")} // Replace with the correct path to your logo
        style={styles.logos}
      />
      
      
      <View style={styles.image}>
      <Image
        source={require("../assets/image.png")} // Replace with the correct path to your logo
        style={styles.logo}
      />
       <Image
        source={require("../assets/image1.png")} // Replace with the correct path to your logo
        style={styles.logo}
      />
      </View>
      <MyTextInput label="Phone Number" state={phone} onChange={setPhone} />
      <MyTextInput label="Password" state={password} onChange={setPassword} />
      <View style={{ width: "100%" }}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSubmit}
        >
          Login
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    color: "white",
    height: "100%",
    justifyContent: "flex-start",
    gap: 12,
  },
  button: {
    backgroundColor: "#22895D",
    color: "white",
    width: "100%",
    padding: 10,
    fontSize: 18
  },
  logo: {
    width: 130, // Set the desired width of the logo
    height: 130, // Set the desired height of the logo
    resizeMode: "contain", // Ensure the logo doesn't get distorted
    alignSelf: "center", // Center the logo horizontally
    marginBottom: 20, // Add some space between the logo and the inputs
  },
  image: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    // justifyContent: "center",
    // marginBottom: -10,
    marginTop: -70,
    width: "100%",
  },
  logos: {
    width: 300, // Set the desired width of the logo
    height: 300, // Set the desired height of the logo
    resizeMode: "contain", // Ensure the logo doesn't get distorted
    alignSelf: "center", // Center the logo horizontally
     // Add some space between the logo and the inputs
    marginTop: -30,
    
  },
});

export default Login;
