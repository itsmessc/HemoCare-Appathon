import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import MyTextInput from "../widgets/textinput"; // Assuming you have this component
// import { ip } from "../constants/variables";
import axios from "axios";
import colors from "../constants/colors";
import Constants from "expo-constants";
const ip = Constants.expoConfig.extra.ip;

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP, Step 3: Reset Password

  const handleSendOtp = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email.");
      return;
    }

    try {
      const response = await axios.post(`${ip}/otp/sendOTP`, { email });
      if (response.status === 200) {
        Alert.alert("Success", "OTP sent to your email.");
        setStep(2); // Move to OTP verification step
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${ip}/otp/validateotp`, {
        email,
        otp,
      });
      if (response.status === 200) {
        Alert.alert(
          "Success",
          "OTP verified. You can now reset your password."
        );
        setStep(3); // Move to reset password step
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 6 characters long."
      );
      return;
    }

    try {
      const response = await axios.post(`${ip}/otp/update`, {
        email,
        newPassword,
      });
      if (response.status === 200) {
        Alert.alert("Success", "Your password has been reset.");
        navigation.navigate("Login"); // Redirect to login screen
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", "Failed to reset password. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    await handleSendOtp(); // Call send OTP function again
  };

  const handleChangeEmail = () => {
    setStep(1); // Go back to email entry step
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Forgot Password</Text>

          {step === 1 && (
            <View>
              <MyTextInput label="Email" state={email} onChange={setEmail} />
              <Button
                mode="contained"
                style={styles.button}
                onPress={handleSendOtp}
              >
                Send OTP
              </Button>
            </View>
          )}

          {step === 2 && (
            <View>
              <MyTextInput label="Enter OTP" state={otp} onChange={setOtp} />
              <Button
                mode="contained"
                style={styles.button}
                onPress={handleVerifyOtp}
              >
                Verify OTP
              </Button>
              <Button
                mode="text"
                style={styles.linkButton}
                onPress={handleResendOtp}
              >
                Resend OTP
              </Button>
              <Button
                mode="text"
                style={styles.linkButton}
                onPress={handleChangeEmail}
              >
                Change Email
              </Button>
            </View>
          )}

          {step === 3 && (
            <View>
              <MyTextInput
                label="New Password"
                state={newPassword}
                onChange={setNewPassword}
                secureTextEntry
              />
              <Button
                mode="contained"
                style={styles.button}
                onPress={handleResetPassword}
              >
                Reset Password
              </Button>
            </View>
          )}

          <Button
            mode="outlined"
            styles={{ color: colors.teal }}
            onPress={() => navigation.navigate("Login")}
          >
            Back to Login
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.teal,
  },
  button: {
    marginVertical: 10,
    backgroundColor: colors.teal,
  },
  linkButton: {
    marginTop: 10,
    color: colors.blue,
  },
});

export default ForgotPassword;
