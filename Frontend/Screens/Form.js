import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import MyTextInput from "../widgets/textinput";
import colors from "../constants/colors";
import DateTimePickerComponent from "../widgets/datepicker";
import Dropdown from "../widgets/dropdown";
import { Button } from "react-native-paper";
import { MachineContext } from "../MachineContext";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import PatientSearchBar from "../widgets/patient_search_bar";
import Constants from "expo-constants";

const ip = Constants.expoConfig.extra.ip;

function Form({ location = null, navigation }) {
  const route = useRoute();
  const mac = route.params.machine ? route.params.machine : "";
  const [locationOptions, setLocationOptions] = useState([]);
  const [machineList, setMachineList] = useState([]);
  const [patientID, setPatientID] = useState("");
  const [notes, setNotes] = useState("");
  const editing = route.params.appointment ? route.params.appointment : "";
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
  }, [locationID, machines, editing]);
  
  useEffect(() => {
    if (editing !== "") {
      setPatientID(editing.patient_id);
      setNotes(editing.notes);
      setDateTime(new Date(editing.start_time));
      setEndtime(editing.end_time);

      // Parse duration
      const duration = parseFloat(editing.duration);
      setHours(Math.floor(duration));
      setMinutes(Math.round((duration % 1) * 100));

      for (const loc in machines) {
        const foundMachine = machines[loc].find(
          (machine) => machine._id === editing.machine_id
        );
        if (foundMachine) {
          setLocationID(loc); // Set the location
          setMachineID(foundMachine._id); // Set the machine ID
          break; // Break out of loop once the machine is found
        }
      }
    }
  }, [editing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add Appointment",
      headerStyle: {
        backgroundColor: colors.teal,
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
        ` Patient: ${app.patient_id}, Start: ${new Date(app.start_time).toLocaleString()}, End: ${new Date(app.end_time).toLocaleString()}`
      ).join('\n');
      alert(`Conflicting Appointments:\n${conflictDetails}`);
      return; // Stop submission
    }

    // Step 4: If no conflicts, proceed to submit the appointment
    try {
      if (editing === '') {
        await axios.post(`${ip}/appointment/addappointment`, {
          patient_id: patientID,
          machine_id: machineID,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration,
          notes,
          type: isReservation ? "Reservation" : "Regular",
          recurring: { 
            enabled: isRecurring, 
            days: Object.keys(selectedDays).filter(day => selectedDays[day])
          }
        });
        alert("Appointment added successfully");
      } else {
        await axios.post(`${ip}/appointment/update`, { 
          _id: editing._id,
          patient_id: patientID,
          machine_id: machineID,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration,
          type: isReservation ? "Reservation" : "Regular",
        });
        alert("Appointment updated successfully");
      }
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
        {editing === '' && (
          <PatientSearchBar data={patients} set={setPatientID} />
        )}
        <Text style={styles.patientIDText}>Patient ID: {patientID}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <DateTimePickerComponent
            title="Select Date and Time"
            dateTime={dateTime}
            setDateTime={setDateTime}
          />
          <Text style={styles.label}>Duration</Text>
          <View style={styles.row}>
            <MyTextInput
              label="Hrs"
              state={(hours ?? "").toString()}
              onChange={(val) => setHours(isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
              style={styles.input}
            />
            <View style={styles.width20} />
            <MyTextInput
              label="Mins"
              state={(minutes ?? "").toString()}
              onChange={(val) => setMinutes(isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
              style={styles.input}
            />
          </View>
          <Text style={styles.endTimeText}>End Time: {new Date(endtime).toLocaleString()}</Text>
        </View>
        {isReservation && (editing=='') && (
        <View style={styles.card}>
        {isReservation && (editing=='') && (
          <View style={styles.row1}>
            <Text style={styles.label}>Recurring for month:</Text>
            <Switch
              value={isRecurring}
              onValueChange={() => setIsRecurring((prev) => !prev)}
              trackColor={{ false: colors.lightGray, true: colors.teal }}
              thumbColor={isRecurring ? colors.teal : "gray"}
              ios_backgroundColor={colors.lightGray}
              style={styles.switch}
            />
          </View>
        )}

        
        {isRecurring &&(
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
        </View>)}

        <View style={styles.card}>
          <Text style={styles.label}>Notes</Text>
          <MyTextInput
            label="Notes"
            state={notes}
            onChange={setNotes}
            multiline={true}
            style={styles.notesInput}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Location</Text>
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

        <Button
          mode="contained"
          onPress={onSubmit}
          style={styles.submitButton}
          labelStyle={styles.submitButtonLabel}
        >
          {editing ? "Update Appointment" : "Create Appointment"}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    padding: 20,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: colors.lightgray,
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1.0,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:colors.teal
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.teal,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  endTimeText: {
    fontSize: 16,
    color: colors.teal,
    marginTop: 10,
    fontWeight: "bold",
  },
  width20: {
    width: 20,
  },
  notesInput: {
    height: 100,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  switchLabel: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: colors.teal,
  },
  submitButtonLabel: {
    fontSize: 18,
  },
  patientIDText: {
    fontSize: 16,
    marginVertical: 10,
    color: colors.teal,
    fontWeight: "bold",
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    justifyContent: "space-between",
  },
  dayToggleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 5,
    
  },
  dayToggleButton: {
    padding: 2,
    paddingVertical: 5,
    borderRadius: 5,
    margin: 3,
    backgroundColor: colors.lightgray,
    alignItems: "center",
    width:90
  },
  activeButton: {
    backgroundColor: colors.teal,
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
});

export default Form;
