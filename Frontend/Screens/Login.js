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
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import colors from "../constants/colors";
import MyTextInput from "../widgets/textinput";
import { getToken, storeToken } from "../store";
import { ip } from "../constants/variables";

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
            source={require("../assets/logo1.png")}
            style={styles.logos}
          />

          <View style={styles.image}>
            <Image
              source={require("../assets/image.png")}
              style={styles.logo}
            />
            <Image
              source={require("../assets/image1.png")}
              style={styles.logo}
            />
          </View>

          <MyTextInput label="Phone Number" state={phone} onChange={setPhone} />
          <MyTextInput
            label="Password"
            state={password}
            onChange={setPassword}
            secureTextEntry
          />

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
    padding: 10,
    fontSize: 18,
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
});

export default Login;
