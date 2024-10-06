import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Text
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import colors from "../constants/colors";
import MyTextInput from "../widgets/textinput";
import { getToken, storeToken } from "../store";
import { ip } from "../constants/variables";
import PasswordInput from "../widgets/passwordinput";
function Login({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Tabs" }],
          });
        }
      } catch (error) {
        console.error("Failed to retrieve token:", error);
      }
    };

    checkToken();
  }, []);

  const handleSubmit = async () => {
    const phoneRegex = /^[0-9]{10}$/; // Adjust this regex as per your requirements (e.g., for 10-digit numbers)
    if (!phoneRegex.test(phone)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
      return;
    }
    try {
      const response = await axios.post(`${ip}/staff/login`, {
        phone,
        password,
      });

      // Handle success
      if (response.status == 200) {
        Alert.alert("Login Successful", "You have logged in successfully");

        await storeToken(response.data.token);
        navigation.reset({
          index: 0,
          routes: [{ name: "Tabs" }],
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Login Failed", "Invalid Phone Number or Password");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }} // Take up the entire screen
        behavior={Platform.OS === "ios" ? "padding" : null} // Use 'padding' for iOS, not needed for Android
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled" // Ensures that tapping outside the input will dismiss the keyboard
        >
          <Image
            source={require("../assets/logo1.jpg")}
            style={styles.logos}
          />

          <View style={styles.image}>
            <Image
              source={require("../assets/image.jpg")}
              style={styles.logo}
            />
            <Image
              source={require("../assets/image1.jpg")}
              style={styles.logo}
            />
          </View>

          <MyTextInput label="Phone Number" state={phone} onChange={setPhone} />
          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            secureTextEntry={!showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          <View style={styles.container1}>
      <Text style={styles.text1}>New User, </Text>
      <Button
        style={styles.regbutton}
        mode="text" // Use text mode for a hyperlink look
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.linkText}>Register</Text>
      </Button>
    </View>
          <View style={{ width: "100%" }}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleSubmit}
            >
              Login
            </Button>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    color: "white",
    justifyContent: "flex-start",
    gap: 12,
    flexGrow: 1, // Ensures the ScrollView takes up all available space
  },
  button: {
    backgroundColor: "#22895D",
    color: "white",
    width: "100%",
    padding: 5,
    fontSize: 18,
    borderRadius:5,
    
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  image: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -70,
    width: "100%",
  },
  logos: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: -30,
  },
  container1: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center',
    justifyContent:'center',
    marginTop: -10,
  },
  text1: {
    fontSize: 16,         // Set the font size
  },
  regbutton: {
    padding: 0,           // Remove padding for text button
  },
  linkText: {
    color: 'blue',        // Blue color for the link
    textDecorationLine: 'underline', // Underline the text
    fontSize: 16,         // Match font size with the text
  },
});

export default Login;
