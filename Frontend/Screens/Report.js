import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button ,Appbar} from 'react-native-paper';
import DateTimePickerComponent from '../widgets/datepicker'; // Assume this is your date picker component
import MyTextInput from '../widgets/textinput'; // Text input for filtering if needed
import Dropdown from '../widgets/dropdown'; // Dropdown component
import {patients, MachineContext } from '../MachineContext'; // Assuming you have a context for machines
// import { ip } from '../constants/variables'; // Your API endpoint
import axios from 'axios';
import { generatePDF } from '../utils/pdfGenerator'; // Utility function for PDF generation
import PatientSearchBar from "../widgets/patient_search_bar";
import Constants from "expo-constants";
import colors from "../constants/colors";
import { Ionicons } from "react-native-vector-icons";
const ip = Constants.expoConfig.extra.ip;
function RepScreen({ navigation }) {
  const { machines,patients } = useContext(MachineContext); // Get machines from context
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [patientID, setPatientID] = useState('');
  const [machineID, setMachineID] = useState(''); // State for selected Machine ID
  const [appointments, setAppointments] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);

  // useEffect(() => {
  //   // Fetch appointments if needed, perhaps on mount
  //   fetchAppointments();
  //   console.log(JSON.stringify(appointments[0])+"Hyy");
    
  // }, []);


  
  useEffect(() => {
    // Prepare machine options for dropdown
    if (machines) {
      const options = Object.keys(machines).map((loc) =>
        machines[loc].map((machine) => ({
          label: machine.manufacturing_serial_number,
          value: machine._id,
        }))
      ).flat(); // Flatten the array of arrays
      setMachineOptions(options);
    }
    // console.log("IPPPPPP"+Constants.expoConfig.extra.ip);
  }, [machines]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.post(`${ip}/appointment/filter`, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        patientID: patientID || undefined,
        mid: machineID || undefined,
      });
  
      // Directly use the response data for generating the PDF
      await generatePDF(response.data); // Pass the fetched appointments directly
      setAppointments(response.data); // Update state with fetched appointments
      // console.log(JSON.stringify(response.data) + " HELLLLLLLO");s
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Failed to fetch appointments. Please try again.');
    }
  };
  
  const handleGenerateReport = async () => {
    // Filter appointments based on date and patientID
    await fetchAppointments();
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appbars}>
        <Appbar.Action icon={()=><Ionicons name="document" size={24} color="#fff"/>} />
        <Appbar.Content
          title="Report"
          titleStyle={{
            color: colors.white,
            fontFamily: "sans-serif",
            fontWeight: "bold",
          }}
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      
        <Text style={styles.title}>Generate Appointment Report</Text>

        <DateTimePickerComponent
          title="Start Date"
          dateTime={startDate}
          setDateTime={setStartDate}
        />
        <DateTimePickerComponent
          title="End Date"
          dateTime={endDate}
          setDateTime={setEndDate}
        />

        {/* <MyTextInput
          label="Patient ID (optional)"
          state={patientID}
          onChange={setPatientID}
          style={styles.input}
        /> */}
        <Text style={styles.patientIDText}>Patient ID:</Text>

        <PatientSearchBar data={patients} set={setPatientID} />


      <View style={styles.dropdownWrapper}>
      <Text style={styles.dropdownLabel}>Machine ID</Text>
      <Dropdown
          placeholder={{ label: "Select Machine", value: null }}
          options={machineOptions}
          value={machineID}
          onValueChange={setMachineID}
        />
      </View>

        <Button
          mode="contained"
          onPress={fetchAppointments}
          style={styles.button}
        >
          Generate Report
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignContent: 'center',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    alignContent: 'center',
    justifyContent: 'center',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.teal,
    width: "100%",
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 15,
  },
  appbars: {
    backgroundColor: "#008080",
    color: colors.teal,
  },
  patientIDText:{
    marginBottom:10,
    marginTop:10,
  },
  dropdownWrapper: {
    marginBottom: 10, // Optional: space below the whole dropdown block
  },
  dropdownLabel: {
    fontSize: 14,
    color: 'black',
    marginBottom: -15, // Space between label and dropdown
    marginTop:20,
  },
});

export default RepScreen;
