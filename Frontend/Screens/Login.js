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
  Text,
  ActivityIndicator,
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
  const [loading, setLoading] = useState(true); // Loading for token check
  const [loginLoading, setLoginLoading] = useState(false); // Loading for login

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
      } finally {
        setLoading(false); // Stop loading after token check
      }
    };

    checkToken();
  }, [navigation]);

  const handleSubmit = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    setLoginLoading(true); // Start loading for login
    try {
      const response = await axios.post(`${ip}/staff/login`, { phone, password });

      if (response.status === 200) {
        Alert.alert("Login Successful", "You have logged in successfully.");
        await storeToken(response.data.token);
        navigation.reset({
          index: 0,
          routes: [{ name: "Tabs" }],
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Login Failed", "Invalid Phone Number or Password");
    } finally {
      setLoginLoading(false); // Stop loading for login
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Image source={require("../assets/logo1.jpg")} style={styles.logos} />

          <View style={styles.imageContainer}>
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
            onTogglePassword={() => setShowPassword((prev) => !prev)}
          />

          {loginLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleSubmit}
            >
              Login
            </Button>
          )}

          <View style={styles.newUserContainer}>
            <Text style={styles.newUserText}>New User? </Text>
            <Button
              style={styles.regButton}
              mode="text"
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.registerLink}>Register Now</Text>
            </Button>
          </View>

          <Button
            style={styles.forgotPasswordButton}
            mode="text"
            onPress={() => navigation.navigate("Forgot")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    flexGrow: 1,
    justifyContent: "center",
  },
  logos: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: -30,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -70,
    width: "100%",
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#22895D",
    width: "100%",
    padding: 5,
    borderRadius: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  newUserContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  newUserText: {
    fontSize: 16,
    color: colors.text,
  },
  registerLink: {
    color: colors.blue,
    fontSize: 16,
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: colors.blue,
    fontSize: 16,
  },
});

export default Login;
