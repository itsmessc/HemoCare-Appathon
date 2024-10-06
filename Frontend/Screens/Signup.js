import React, { useState } from "react";
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
  Text,
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import colors from "../constants/colors";
import PasswordInput from "../widgets/passwordinput";
import { ip } from "../constants/variables";
import MyTextInput from "../widgets/textinput";

function Register({ navigation }) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    // Phone number validation using regex
    const phoneRegex = /^[0-9]{10}$/; // Adjust this regex as per your requirements (e.g., for 10-digit numbers)
    if (!phoneRegex.test(phone)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please make sure both passwords match.");
      return;
    }

    try {
      const response = await axios.post(`${ip}/staff/addstaff`, {
        name,
        position,
        phone,
        blood_group: bloodGroup,
        password,
      });
      if (response.status==201){
        Alert.alert("Existing User", "You have already registered, Login to continue");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
      // Handle success
      else if (response.status === 200) {
        Alert.alert("Registration Successful", "You have registered successfully");
        navigation.reset({
          index: 0,
          routes: [{ name: "Tabs" }],
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      Alert.alert("Registration Failed", "Please check your details and try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../assets/logo1.jpg")}
            style={styles.logoImage}
          />

          <MyTextInput label="Name" state={name} onChange={setName} />
          <MyTextInput label="Position" state={position} onChange={setPosition} />
          <MyTextInput label="Phone Number" state={phone} onChange={setPhone} />
          <MyTextInput label="Blood Group" state={bloodGroup} onChange={setBloodGroup} />

          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            secureTextEntry={!showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <PasswordInput
            label="Re-enter Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <View style={styles.container1}>
            <Text style={styles.text1}>Existing User, </Text>
            <Button
              style={styles.regbutton}
              mode="text"
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.linkText}>Login</Text>
            </Button>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleSubmit}
            >
              Register
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
    justifyContent: "flex-start",
    flexGrow: 1,
  },
  logoImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#22895D",
    width: "100%",
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: -15,
  },
  container1: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
  text1: {
    fontSize: 16, // Set the font size
  },
  regbutton: {
    padding: 0, // Remove padding for text button
  },
  linkText: {
    color: 'blue', // Blue color for the link
    textDecorationLine: 'underline', // Underline the text
    fontSize: 16, // Match font size with the text
  },
});

export default Register;
