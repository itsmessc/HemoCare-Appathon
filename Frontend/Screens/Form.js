import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch
} from "react-native";
import MyTextInput from "../widgets/textinput";
import colors from "../constants/colors";
import DateTimePickerComponent from "../widgets/datepicker";
import Dropdown from "../widgets/dropdown";
import { Button } from "react-native-paper";
import { MachineContext } from "../MachineContext";
import axios from "axios";
import { ip } from "../constants/variables";
import { useRoute } from "@react-navigation/native";
import PatientSearchBar from "../widgets/patient_search_bar";

function Form({ location = null, navigation }) {
  const route = useRoute();
  const mac = route.params.machine ? route.params.machine : "";
  const [locationOptions, setLocationOptions] = useState([]);
  const [machineList, setMachineList] = useState([]);
  const [patientID, setPatientID] = useState("");
  const [notes, setNotes] = useState("");
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [locationID, setLocationID] = useState(location);
  const [machineID, setMachineID] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [endtime, setEndtime] = useState("");
  const { machines, patients, appointments } = useContext(MachineContext);
  
  // Recurring state
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

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
      setEndtime(endTime.toISOString());
    };

    computeEndTime();
  }, [dateTime, hours, minutes]);

  useEffect(() => {
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
    const startTime = new Date(dateTime);
    const endTime = new Date(startTime);
    if (hours) endTime.setHours(endTime.getHours() + hours);
    if (minutes) endTime.setMinutes(endTime.getMinutes() + minutes);
  
    // Buffer times
    const bufferTime = 60 * 60 * 1000; // 1 hour in milliseconds
    const bufferedStartTime = new Date(startTime.getTime() - bufferTime);
    const bufferedEndTime = new Date(endTime.getTime() + bufferTime);
  
    // Step 2: Check for conflicts in existing appointments
    const conflicts = appointments.filter(appointment => 
      appointment.machine_id === machineID &&
      new Date(appointment.start_time) < bufferedEndTime &&
      new Date(appointment.end_time) > bufferedStartTime
    );
  
    if (conflicts.length > 0) {
      // Step 3: Show an alert with details of the conflicting appointments
      const conflictDetails = conflicts.map(app => 
        `ID: ${app._id}, Patient: ${app.patient_id}, Start: ${new Date(app.start_time).toLocaleString()}, End: ${new Date(app.end_time).toLocaleString()}`
      ).join('\n');
      alert(`Conflicting Appointments:\n${conflictDetails}`);
      return; // Stop submission
    }
  
    // Step 4: If no conflicts, proceed to submit the appointment
    try {
      await axios.post(`${ip}/appointment/addappointment`, {
        patient_id: patientID,
        machine_id: machineID,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration,
        type: isReservation ? "Reservation" : "Regular",
        recurring: { 
          enabled: isRecurring, 
          days: Object.keys(selectedDays).filter(day => selectedDays[day])
        }
      });
  
      alert("Appointment added successfully");
      navigation.navigate("Dashboard");
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("Error submitting appointment. Please try again.");
    }
  }
  

  const handleDayChange = (day) => {
    setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PatientSearchBar data={patients} set={setPatientID} />
        <Text style={styles.patientIDText}>Patient ID: {patientID}</Text>

        <DateTimePickerComponent
          title="Select Date and Time"
          dateTime={dateTime}
          setDateTime={setDateTime}
        />

        <Text style={styles.label}>Duration</Text>
        <View style={styles.row}>
          <MyTextInput
            label="Hrs"
            value={(hours ?? "").toString()}
            onChange={(val) => setHours(isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
            style={styles.input}
          />
          <View style={styles.width20} />
          <MyTextInput
            label="Mins"
            value={(minutes ?? "").toString()}
            onChange={(val) => setMinutes(isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
            style={styles.input}
          />
        </View>
        <Text style={styles.endTimeText}>End Time: {new Date(endtime).toLocaleString()}</Text>

        {isReservation && (
          <View style={styles.row}>
            <Text style={styles.label}>Recurring for month:</Text>
            <Switch
              value={isRecurring}
              onValueChange={() => setIsRecurring((prev) => !prev)}
              trackColor={{ false: colors.lightGray, true: colors.darkgreen }}
              thumbColor={isRecurring ? colors.white : colors.gray}
              ios_backgroundColor={colors.lightGray}
              style={styles.switch}
            />
          </View>
        )}

        
        {isRecurring && (
          <View style={styles.dayToggleContainer}>
            {Object.keys(selectedDays).map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayToggleButton, selectedDays[day] ? styles.activeButton : styles.inactiveButton]}
                onPress={() => handleDayChange(day)}
              >
                <Text style={[selectedDays[day] ? styles.dayText : styles.blacktext]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <MyTextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={styles.input}
        />

        <View>
          <Dropdown
            label="Select location"
            placeholder={{ label: "Select Location", value: null }}
            options={locationOptions}
            value={mac === "" ? locationID : mac.location}
            onValueChange={setLocationID}
          />
          <Dropdown
            label="Select Machine ID"
            placeholder={{ label: "Select Machine", value: null }}
            options={machineList}
            value={mac === "" ? machineID : mac._id}
            onValueChange={setMachineID}
          />
        </View>

        <View style={styles.buttonContainer}>
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
  patientIDText: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
    color: colors.darkgreen,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    marginVertical: 5,
    color: colors.darkgreen,
  },
  endTimeText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.darkgreen,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  width20: {
    width: 5,
  },
  input: {
    flex: 1,
  },
  dayToggleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 5,
  },
  dayToggleButton: {
    padding: 8,
    borderRadius: 5,
    margin: 5,
    backgroundColor: colors.lightgray,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: colors.darkgreen,
  },
  inactiveButton: {
    backgroundColor: colors.lightgray,
    borderColor:colors.black,
    borderWidth:1
  },
  dayText: {
    color: colors.white,
  },
  blacktext: {
    color: colors.black,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderColor: colors.darkgreen,
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: colors.darkgreen,
  },
});

export default Form;
