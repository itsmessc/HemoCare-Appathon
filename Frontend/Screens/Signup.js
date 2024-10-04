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
  TouchableOpacity,
  Text,
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import colors from "../constants/colors";
import MyTextInput from "../widgets/textinput"; // Ensure this component can accept props for visibility toggle
import { ip } from "../constants/variables";

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
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please make sure both passwords match.");
      return;
    }

    try {
      const response = await axios.post(`${ip}/staff/register`, {
        name,
        position,
        phone,
        blood_group: bloodGroup,
        password,
      });

      // Handle success
      if (response.status === 201) {
        Alert.alert("Registration Successful", "You have registered successfully");
        navigation.navigate("Login"); // Navigate to login page after registration
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
            source={require("../assets/logo1.png")}
            style={styles.logoImage}
          />

          <MyTextInput label="Name" state={name} onChange={setName} />
          <MyTextInput label="Position" state={position} onChange={setPosition} />
          <MyTextInput label="Phone Number" state={phone} onChange={setPhone} />
          <MyTextInput label="Blood Group" state={bloodGroup} onChange={setBloodGroup} />

          <View style={styles.passwordContainer}>
            <MyTextInput
              label="Password"
              state={password}
              onChange={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <MyTextInput
              label="Re-enter Password"
              state={confirmPassword}
              onChange={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={styles.toggleText}>{showConfirmPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
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
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    alignItems: "center",
  },
  additionalImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  toggleText: {
    color: "#22895D",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#22895D",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default Register;
