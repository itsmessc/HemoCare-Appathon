import React, { useEffect, useState, useContext } from "react";
import {
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity, // For row click events
} from "react-native";
import { DataTable } from "react-native-paper";
import axios from "axios";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { ip } from "../constants/variables";
import { MachineContext } from "../MachineContext";
import colors from "../constants/colors"; // Assuming your colors are defined in constants/colors.js

const PatientMasterSheet = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appointments, machines } = useContext(MachineContext);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRowIndex, setExpandedRowIndex] = useState(null); // To track expanded row

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${ip}/patient/getdetails`);
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const getLocationByMachineId = (machineId) => {
    for (const location in machines) {
      const mach = machines[location];
      const foundMachine = mach.find((machine) => machine._id === machineId);
      if (foundMachine) {
        return { location: location, machineDetails: foundMachine };
      }
    }
    return null;
  };

  const formatDate = (timestamp) => moment(timestamp).format("DD/MM/YYYY");
  const formatDay = (timestamp) => moment(timestamp).format("dddd");

  const clearFilters = () => {
    setSelectedMonth("");
    setSelectedDay("");
    setSelectedLocation("");
    setSearchQuery("");
  };

  const filteredPatients = patients
    .flatMap((patient) => {
      // Find all appointments for the current patient
      const patientAppointments = appointments.filter(
        (appt) => appt.patient_id === patient.patient_id
      );

      // Map each appointment to an object with patient and appointment data
      return patientAppointments.map((appointment) => ({
        patient,
        appointment,
      }));
    })
    .filter(({ appointment }) => {
      // Apply filters
      const appointmentMonth = moment(appointment.start_time).format("MM");
      const appointmentDay = moment(appointment.start_time).format("dddd");
      const location = getLocationByMachineId(appointment.machine_id)?.location;

      const isMonthMatch = selectedMonth
        ? appointmentMonth === selectedMonth
        : true;
      const isDayMatch = selectedDay ? appointmentDay === selectedDay : true;
      const isLocationMatch = selectedLocation
        ? location === selectedLocation
        : true;

      return isMonthMatch && isDayMatch && isLocationMatch;
    })
    .filter(({ patient }) => {
      return (
        patient.patient_id.includes(searchQuery) ||
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const handleRowPress = (index) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };

  const renderPatientRows = () => {
    return filteredPatients.map(({ patient, appointment }, index) => (
      <View key={`${patient._id}-${appointment._id}`}>
        <TouchableOpacity onPress={() => handleRowPress(index)}>
          <DataTable.Row style={styles.tableRow}>
            <DataTable.Cell style={styles.cell1}>
              {patient.patient_id}
            </DataTable.Cell>
            <DataTable.Cell style={styles.cell2}>{patient.name}</DataTable.Cell>
            <DataTable.Cell style={styles.cell2}>
              {getLocationByMachineId(appointment.machine_id)?.location}
            </DataTable.Cell>
            <DataTable.Cell style={styles.cell}>
              {formatDate(appointment.start_time)}
            </DataTable.Cell>
          </DataTable.Row>
        </TouchableOpacity>

        {/* Conditionally render expanded view for this row */}
        {expandedRowIndex === index && (
          <View style={styles.expandedView}>
            <Text>Gender: {patient.gender}</Text>
            <Text>Phone: {patient.phone}</Text>
            <Text>
              Location:{" "}
              {getLocationByMachineId(appointment.machine_id)?.location}
            </Text>
            <Text>Appointment Day: {formatDay(appointment.start_time)}</Text>
          </View>
        )}
      </View>
    ));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
        <Text>Loading patient data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by ID or name"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Filter Options */}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Month" value="" />
          <Picker.Item label="January" value="01" />
          <Picker.Item label="February" value="02" />
          <Picker.Item label="March" value="03" />
          <Picker.Item label="April" value="04" />
          <Picker.Item label="May" value="05" />
          <Picker.Item label="June" value="06" />
          <Picker.Item label="July" value="07" />
          <Picker.Item label="August" value="08" />
          <Picker.Item label="September" value="09" />
          <Picker.Item label="October" value="10" />
          <Picker.Item label="November" value="11" />
          <Picker.Item label="December" value="12" />
        </Picker>

        <Picker
          selectedValue={selectedDay}
          onValueChange={(itemValue) => setSelectedDay(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Day" value="" />
          <Picker.Item label="Monday" value="Monday" />
          <Picker.Item label="Tuesday" value="Tuesday" />
          <Picker.Item label="Wednesday" value="Wednesday" />
          <Picker.Item label="Thursday" value="Thursday" />
          <Picker.Item label="Friday" value="Friday" />
          <Picker.Item label="Saturday" value="Saturday" />
          <Picker.Item label="Sunday" value="Sunday" />
        </Picker>

        <Picker
          selectedValue={selectedLocation}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Location" value="" />
          <Picker.Item label="VIP" value="VIP" />
          <Picker.Item label="Manipal" value="Manipal" />
          <Picker.Item label="ISU" value="ISU" />
          <Picker.Item label="OPD" value="OPD" />
        </Picker>

        <Button
          title="Clear Filters"
          onPress={clearFilters}
          color={colors.red}
        />
      </View>

      {/* Data Table */}
      <ScrollView horizontal={true}>
        <ScrollView>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title style={styles.cell1}>Patient ID</DataTable.Title>
              <DataTable.Title style={styles.cell2}>Name</DataTable.Title>
              <DataTable.Title style={styles.cell2}>Location</DataTable.Title>
              <DataTable.Title style={styles.cell}>
                Appointment Date
              </DataTable.Title>
            </DataTable.Header>

            {/* Render the rows with expand/collapse functionality */}
            {renderPatientRows()}
          </DataTable>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: 50,
    borderColor: colors.lightgray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  picker: {
    flex: 1,
    height: 50,
    width: 200,
    marginHorizontal: 5,
    backgroundColor: colors.white,
    borderColor: colors.lightgray,
    borderWidth: 1,
    borderRadius: 8,
  },
  tableHeader: {
    backgroundColor: colors.lightgreen,
    marginLeft: -20,
    marginRight: -20,
  },
  tableRow: {
    backgroundColor: colors.lightblue,
    borderWidth: 0.5, // Thin border around each cell
    borderColor: colors.lightgray,
    marginLeft: -20, // To align with the expanded view
    marginRight: -20, // To align with the expanded view
  },
  cell: {
    width: 110, // Adjust to fit your screen width
    justifyContent: "center",
    textAlign: "center",
    borderWidth: 0.5, // Thin border around each cell
    borderColor: colors.lightgray,
  },
  cell2: {
    width: 80, // Adjust to fit your screen width
    justifyContent: "center",
    textAlign: "center",
    borderWidth: 0.5, // Thin border around each cell
    borderColor: colors.lightgray,
  },
  cell1: {
    width: 65, // Adjust to fit your screen width
    justifyContent: "center",
    textAlign: "center",
    borderWidth: 0.5, // Thin border around each cell
    borderColor: colors.lightgray,
  },
  expandedView: {
    backgroundColor: colors.lightgray,
    padding: 10,
    marginTop: -1, // To align directly below the clicked row
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default PatientMasterSheet;