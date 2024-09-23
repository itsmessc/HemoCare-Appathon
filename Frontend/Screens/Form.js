import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import MyTextInput from "../widgets/textinput";
import colors from "../constants/colors";
import DateTimePickerComponent from "../widgets/datepicker";
import Dropdown from "../widgets/dropdown";
import { Button } from "react-native-paper";
import { MachineContext } from "../MachineContext";
import axios from 'axios';
import { ip } from "../constants/variables";
import { useRoute } from "@react-navigation/native";

function Form({ location = null, navigation }) {
  const route = useRoute();
  const mac=route.params.machine?route.params.machine:"";
  const [locationOptions, setLocationOptions] = useState([]);
  const [machineList, setMachineList] = useState([]);
  const [patientID, setPatientID] = useState("");
  const [notes, setNotes] = useState("");
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [locationID, setLocationID] = useState(location);
  const [machineID, setMachineID] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [endtime, setEndtime] = useState('');
  const { machines } = useContext(MachineContext);

  const isReservation = mac === "";

  useEffect(() => {
    if (machines) {
      const locs = Object.keys(machines);
      setLocationOptions(locs.map((loc) => ({ label: loc, value: loc })));
    }
  }, [machines]);

  useEffect(() => {
    const computeEndTime = () => {
      const endTime = new Date(dateTime);
      if (hours) endTime.setHours(endTime.getHours() + hours);
      if (minutes) endTime.setMinutes(endTime.getMinutes() + minutes);
      setEndtime(endTime.toISOString()); // Format as needed
    };

    computeEndTime();
  }, [dateTime, hours, minutes]);

  useEffect(() => {
    console.log("Changing");
    
    if (locationID && machines[locationID]) {
      const machineOptions = machines[locationID].map((machine) => ({
        label: machine.manufacturing_serial_number,
        value: machine._id,
        status: machine.status,
      }));


      
      setMachineList(machineOptions);
    } else {
      setMachineList([]);
    }
  }, [locationID, machines]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Form",
      headerStyle: {
        backgroundColor: colors.darkgreen,
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation]);

  async function onSubmit() {
    if (!patientID || !machineID || !dateTime) {
      alert("Please fill out all required fields.");
      return;
    }

    const duration = `${hours || 0}.${minutes || 0}`;

    try {
      const response = await axios.post(`${ip}/appointment/addappointment`, {
        patient_id: patientID,
        machine_id: machineID,
        start_time: dateTime.toISOString(),
        end_time: endtime, // Make sure endtime is in the correct format
        appointment_time: endtime, // Adjust this field as necessary
        duration,
        type: isReservation?"Reservation":"Regular"
      });
      console.log("Appointment submitted successfully:", response.data);
      navigation.navigate("Dashboard");
      alert("Appointment added successful")
    } catch (error) {
      console.error("Error submitting appointment:", error.response?.data || error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <MyTextInput
        label="Patient ID"
        value={patientID}
        onChange={setPatientID}
      />
      <DateTimePickerComponent
        title="Select Date and Time"
        dateTime={dateTime}
        setDateTime={setDateTime}
      />
      <Text>Duration</Text>
      <View style={styles.row}>
        <MyTextInput
          label="Hrs"
          value={(hours ?? "").toString()}
          onChange={(val) => setHours(isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
        />
        <View style={styles.width20} />
        <MyTextInput
          label="Mins"
          value={(minutes ?? "").toString()}
          onChange={(val) => setMinutes(isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
        />
      </View>
      <Text>End Time: {new Date(endtime).toLocaleString()}</Text>
      <MyTextInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <View>
          <Dropdown
            label="Select location"
            placeholder={{ label: "Select Location", value: null }}
            options={locationOptions}
            value={mac == ""?locationID:mac.location}
            onValueChange={setLocationID}
          />
        <Dropdown
          label="Select Machine ID"
          placeholder={{ label: "Select Machine", value: null }}
          options={machineList}
          value={mac==""?machineID:mac._id}
          onValueChange={setMachineID}
        />
      </View>
      <View style={styles.row}>
        <Button
          style={styles.cancelButton}
          labelStyle={{ color: colors.black }}
          mode="outlined"
          onPress={() => navigation.navigate("Dashboard")}
        >
          Cancel
        </Button>
        <Button
          style={styles.submitButton}
          mode="contained"
          onPress={onSubmit}
        >
          Submit
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    height: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  width20: {
    width: 20,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderColor: colors.darkgreen,
    borderWidth: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: colors.darkgreen,
  },
});

export default Form;
