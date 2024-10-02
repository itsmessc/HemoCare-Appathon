  import React, {
    useContext,
    useEffect,
    useState,
    useLayoutEffect,
    useCallback,
  } from "react";
  import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    ScrollView,
    TextInput,
    Switch,
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
  import debounce from "lodash.debounce";
  // import CheckBox from '@react-native-community/checkbox';

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
        setEndtime(endTime.toISOString()); // Format as needed
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
      const endTime = new Date(dateTime);
      if (hours) endTime.setHours(endTime.getHours() + hours);
      if (minutes) endTime.setMinutes(endTime.getMinutes() + minutes);

      // Define buffer times
      const bufferStartTime = new Date(dateTime);
      bufferStartTime.setHours(bufferStartTime.getHours() - 1); // 1 hour before
      const bufferEndTime = new Date(endTime);
      bufferEndTime.setHours(bufferEndTime.getHours() + 1); // 1 hour after

      const machappp = appointments.filter((app) => app.machine_id == machineID);

      // Check for overlapping appointments
      const hasOverlap = machappp.some((appointment) => {
        const existingStartTime = new Date(appointment.start_time);
        const existingEndTime = new Date(appointment.end_time);

        return (
          (dateTime >= existingStartTime && dateTime < existingEndTime) || // New start time is within existing
          (endTime > existingStartTime && endTime <= existingEndTime) || // New end time is within existing
          (dateTime < existingStartTime && endTime > existingEndTime)    // New time completely overlaps existing
        );
      });

      // Check for 1-hour buffer
      const hasBufferOverlap = machappp.some((appointment) => {
        const existingStartTime = new Date(appointment.start_time);
        const existingEndTime = new Date(appointment.end_time);

        return (
          (bufferStartTime < existingEndTime && bufferStartTime >= existingStartTime) || // Buffer start overlaps
          (bufferEndTime > existingStartTime && bufferEndTime <= existingEndTime) ||     // Buffer end overlaps
          (bufferStartTime <= existingStartTime && bufferEndTime >= existingEndTime)     // Buffer completely overlaps existing
        );
      });

      if (hasOverlap || hasBufferOverlap) {
        alert("This appointment conflicts with an existing appointment. Please choose another time.");
        return;
      }

      try {
        const response = await axios.post(`${ip}/appointment/addappointment`, {
          patient_id: patientID,
          machine_id: machineID,
          start_time: dateTime.toISOString(),
          end_time: endTime.toISOString(),
          appointment_time: endTime.toISOString(), // Adjust this field as necessary
          duration,
          type: isReservation ? "Reservation" : "Regular",
          recurring: isRecurring ? {
            enabled: true,
            days: Object.keys(selectedDays).filter(day => selectedDays[day]) // Send only selected days
          } : null
        });
        console.log("Appointment submitted successfully:", Object.keys(selectedDays).filter(day => selectedDays[day]));
        navigation.navigate("Dashboard");
        alert("Appointment added successfully");
      } catch (error) {
        console.error(
          "Error submitting appointment:",
          error.response?.data || error.message
        );
      }
    }

    const handleDayChange = (day) => {
      setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }));
    };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <PatientSearchBar 
          data={patients} 
          set={setPatientID} 
        />
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
    Patient ID: {patientID}
  </Text>

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
              onChange={(val) =>
                setHours(isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))
              }
            />
            <View style={styles.width20} />
            <MyTextInput
              label="Mins"
              value={(minutes ?? "").toString()}
              onChange={(val) =>
                setMinutes(isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))
              }
            />
          </View>
          <Text>End Time: {new Date(endtime).toLocaleString()}</Text>

          <View style={styles.row}>
            <Text>Recurring for month:</Text>
            <Switch
              value={isRecurring}
              onValueChange={() => setIsRecurring((prev) => !prev)}
            />
          </View>
          {isRecurring && (
            <View style={styles.checkboxContainer}>
              {Object.keys(selectedDays).map((day) => (
                <View key={day} style={styles.row}>
                  <Switch
                    value={selectedDays[day]}
                    onValueChange={() => handleDayChange(day)}
                  />
                  <Text>{day}</Text>
                </View>
              ))}
            </View>
          )}
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
              value={mac == "" ? locationID : mac.location}
              onValueChange={setLocationID}
            />
            <Dropdown
              label="Select Machine ID"
              placeholder={{ label: "Select Machine", value: null }}
              options={machineList}
              value={mac == "" ? machineID : mac._id}
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
        </ScrollView>
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
    checkboxContainer: {
      marginVertical: 10,
      marginLeft: 10,
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
