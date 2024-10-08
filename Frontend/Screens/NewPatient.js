import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Platform,
  TouchableOpacity
} from "react-native";
import MyTextInput from "../widgets/textinput";
import Dropdown from "../widgets/dropdown"; // Import your dropdown component
import colors from "../constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native-paper";
import axios from "axios";
// import { ip } from "../constants/variables"; // Your API endpoint
import Constants from "expo-constants";
const ip = Constants.expoConfig.extra.ip;

function AddPatientForm({ navigation }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
    
  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const handleSubmit = async () => {
    if (!name || !dob || !gender || !phone) {
      alert("Please fill out all required fields."+name+dob+gender+phone);
      return;
    }

    const patientData = {
      name,
      dob: dob.toISOString().split("T")[0], // Format to YYYY-MM-DD
      gender,
      phone,
      blood_group: bloodGroup,
    };

    try {
      await axios.post(`${ip}/patient/newpatient`, patientData);
      alert("Patient added successfully");
      navigation.navigate("Dashboard");
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient. Please try again.");
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios');
    setDob(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Add New Patient</Text>
        <MyTextInput label="Name" value={name} onChange={(val)=>setName(val)} />
        <Text style={styles.dateText1}>
    Date of Birth:
  </Text>
        <TouchableOpacity 
  style={styles.dateInput} 
  onPress={() => setShowDatePicker(true)}
>
  <Text style={styles.dateText}>
    {dob.toISOString().split("T")[0]} {/* Display selected date */}
  </Text>
</TouchableOpacity>



        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        <Dropdown
          label="Gender"
          placeholder={{ label: "Select Gender", value: null }}
          options={genderOptions}
          value={gender}
          onValueChange={setGender}
        />
        
        <MyTextInput label="Phone" value={phone} onChange={(val)=>setPhone(val)} />
        <MyTextInput label="Blood Group" value={bloodGroup} onChange={(val)=>setBloodGroup(val)} />

        <View style={styles.buttonContainer}>
          <Button
            style={styles.cancelButton}
            mode="outlined"
            onPress={() => navigation.navigate("Dashboard")}
          >
            Cancel
          </Button>
          <Button
            style={styles.submitButton}
            mode="contained"
            onPress={handleSubmit}
          >
            Submit
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.teal,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderColor: colors.teal,
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor:colors.teal,
  },
  dateInput: {
    width: '100%', // Occupy 100% width
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightGray, // Customize based on your theme
    borderRadius: 5,
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items verticall
    backgroundColor:colors.teal,
    
  },
  dateText: {
    fontSize: 16,
    color: 'white', // Change text color to green
    textAlign: 'center', // Center the text
  },
  dateText1: {
    fontSize: 16,
    color: 'black', 
    marginTop:10
  },
});

export default AddPatientForm;
