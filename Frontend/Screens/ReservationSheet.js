import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import axios from "axios";
// import { ip } from "../constants/variables";
import Constants from "expo-constants";
const ip = Constants.expoConfig.extra.ip;
import { MachineContext } from "../MachineContext";
import colors from "../constants/colors";

const ReservationSheet = ({ route, navigation }) => {
  const { appointment } = route.params || {}; // Receive the appointment data
  const [patientId, setPatientId] = useState("");
  const [machineId, setMachineId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const { machines } = useContext(MachineContext);

  useEffect(() => {
    // If editing, populate the fields with existing data
    if (appointment) {
      setPatientId(appointment.patient_id);
      setMachineId(appointment.machine_id);
      setStartTime(appointment.start_time);
      setDuration(appointment.duration);
    }
  }, [appointment]);

  const handleSubmit = async () => {
    if (!patientId || !machineId || !startTime || !duration) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (appointment) {
        // Edit existing appointment
        await axios.put(`${ip}/appointment/update/${appointment._id}`, {
          patient_id: patientId,
          machine_id: machineId,
          start_time: startTime,
          duration: duration,
        });
        Alert.alert("Success", "Appointment updated successfully.");
      } else {
        // Handle creating a new appointment
        await axios.post(`${ip}/appointment/create`, {
          patient_id: patientId,
          machine_id: machineId,
          start_time: startTime,
          duration: duration,
        });
        Alert.alert("Success", "Appointment created successfully.");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error updating appointment:", error);
      Alert.alert("Error", "Failed to update appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Patient ID:</Text>
      <TextInput
        style={styles.input}
        value={patientId}
        onChangeText={setPatientId}
        editable={!appointment} // Disable editing if it's an existing appointment
      />

      <Text style={styles.label}>Machine ID:</Text>
      <TextInput
        style={styles.input}
        value={machineId}
        onChangeText={setMachineId}
      />

      <Text style={styles.label}>Start Time:</Text>
      <TextInput
        style={styles.input}
        value={startTime}
        onChangeText={setStartTime}
      />

      <Text style={styles.label}>Duration:</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
      />

      <Button
        title={appointment ? "Update Appointment" : "Create Appointment"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: colors.lightgray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: colors.white,
  },
});

export default ReservationSheet;
