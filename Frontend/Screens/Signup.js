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
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please make sure both passwords match."
      );
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

      if (response.status == 201) {
        Alert.alert(
          "Existing User",
          "You have already registered, Login to continue"
        );
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      } else if (response.status === 200) {
        Alert.alert(
          "Registration Successful",
          "You have registered successfully"
        );
        navigation.reset({
          index: 0,
          routes: [{ name: "Tabs" }],
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      Alert.alert(
        "Registration Failed",
        "Please check your details and try again."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Logo and Heading */}
          <Image
            source={require("../assets/logo1.png")}
            style={styles.logoImage}
          />
          <Text style={styles.welcomeText}>Create a New Account</Text>

          {/* Form Fields */}
          <MyTextInput label="Full Name" state={name} onChange={setName} />
          <MyTextInput
            label="Position"
            state={position}
            onChange={setPosition}
          />
          <MyTextInput label="Phone Number" state={phone} onChange={setPhone} />
          <MyTextInput
            label="Blood Group"
            state={bloodGroup}
            onChange={setBloodGroup}
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            secureTextEntry={!showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          {/* Register Button */}
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleSubmit}
            >
              Register
            </Button>
          </View>

          {/* Login Redirection */}
          <View style={styles.loginContainer}>
            <Text style={styles.existingUserText}>Already Registered?</Text>
            <Button
              style={styles.loginButton}
              mode="text"
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>Login</Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  logoImage: {
    width: 240,
    height: 120,
    alignSelf: "center",
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: colors.darkgreen,
    marginBottom: 25,
  },
  buttonContainer: {
    marginTop: 5,
    width: "100%",
  },
  button: {
    backgroundColor: colors.darkgreen,
    paddingVertical: 5,
    borderRadius: 10,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  existingUserText: {
    fontSize: 16,
    color: colors.text,
    marginRight: 5,
  },
  loginButton: {
    padding: 0,
  },
  loginText: {
    color: colors.blue,
    fontSize: 16,
    padding: 0,
  },
});

export default Register;