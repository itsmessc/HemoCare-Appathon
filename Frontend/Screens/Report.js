import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePickerComponent from '../widgets/datepicker'; // Assume this is your date picker component
import MyTextInput from '../widgets/textinput'; // Text input for filtering if needed
import Dropdown from '../widgets/dropdown'; // Dropdown component
import {patients, MachineContext } from '../MachineContext'; // Assuming you have a context for machines
import { ip } from '../constants/variables'; // Your API endpoint
import axios from 'axios';
import { generatePDF } from '../utils/pdfGenerator'; // Utility function for PDF generation
import PatientSearchBar from "../widgets/patient_search_bar";
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
  }, [machines]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.post(`${ip}/appointment/filter`, {
        startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          patientID: patientID || undefined, // Only include if defined
          mid: machineID || undefined, // Only include if defined
      });
      // console.log(JSON.stringify(response.data)+"llll")
      setAppointments(response.data); // Store fetched appointments
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleGenerateReport = async () => {
    // Filter appointments based on date and patientID
    fetchAppointments();
    try {
      await generatePDF(appointments);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.patientIDText}>Patient ID: (optional)</Text>

        <PatientSearchBar data={patients} set={setPatientID} />

        <Dropdown
          label="Select Machine ID"
          placeholder={{ label: "Select Machine", value: null }}
          options={machineOptions}
          value={machineID}
          onValueChange={setMachineID}
        />

        <Button
          mode="contained"
          onPress={handleGenerateReport}
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
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default RepScreen;
