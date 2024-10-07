import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { DataTable, Appbar } from "react-native-paper";
import axios from "axios";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { ip } from "../constants/variables";
import { MachineContext } from "../MachineContext";
import colors from "../constants/colors"; // Assuming your colors are defined in constants/colors.js
import Icon from "react-native-vector-icons/FontAwesome";
const PatientMasterSheet = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appointments, machines } = useContext(MachineContext);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // For bottom drawer

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
      const patientAppointments = appointments.filter(
        (appt) => appt.patient_id === patient.patient_id
      );
      return patientAppointments.map((appointment) => ({
        patient,
        appointment,
      }));
    })
    .filter(({ appointment }) => {
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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Toggle the modal visibility
  };

  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to cancel the appointment
      await axios.delete(`${ip}/appointment/cancelappointment/${id}`);

      // Show an alert after a successful cancellation
      Alert.alert(
        "Cancel Appointment, Appointment has been canceled successfully."
      );
    } catch (err) {
      // Log the error and show an alert with error information
      console.error("Error canceling appointment:", err);
      Alert.alert(
        "Cancel Appointment, Failed to cancel appointment with ID: ${id}. Please try again later."
      );
    }
  };
  const handleEdit = (appointment) => {
    console.log(appointment.patient_id + "Huuulla");
    navigation.navigate("Form", { appointment }); // Assuming you have a form screen for editing
  };
 
  const renderPatientRows = () => {
    return filteredPatients.map(({ patient, appointment }, index) => (
      <View key={`${patient._id}-${appointment._id}`}>
        <TouchableOpacity onPress={() => handleRowPress(index)}>
          <DataTable.Row style={styles.tableRow}>
            <DataTable.Cell style={styles.cell1}>
              {patient.patient_id}
            </DataTable.Cell>
            <DataTable.Cell style={styles.cell}>{patient.name}</DataTable.Cell>
            <DataTable.Cell style={styles.cell2}>
              {getLocationByMachineId(appointment.machine_id)?.location}
            </DataTable.Cell>
            <DataTable.Cell style={styles.cell3}>
              {formatDate(appointment.start_time)}
            </DataTable.Cell>
          </DataTable.Row>
        </TouchableOpacity>

        {expandedRowIndex === index && (
          <View style={styles.expandedView}>
            <View style={styles.patientDetails}>
              <Text style={styles.detailText}>Gender: {patient.gender}</Text>
              <Text style={styles.detailText}>Phone: {patient.phone}</Text>
              <Text style={styles.detailText}>
                Location:{" "}
                {getLocationByMachineId(appointment.machine_id)?.location}
              </Text>
              <Text style={styles.detailText}>
                Appointment Day: {formatDay(appointment.start_time)}
              </Text>
            </View>

            {/* Edit and Delete Buttons with Icons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionButton1}
                onPress={() => handleEdit(appointment)}
              >
                <Text style={styles.actionText}>Edit</Text>
                <Icon name="edit" size={20} color={colors.orange} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton2}
                onPress={() => handleDelete(appointment._id)}
              >
                <Text style={styles.actionText}>Delete</Text>
                <Icon name="trash" size={20} color={colors.black} />
              </TouchableOpacity>
            </View>
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
      {/* App Bar with Heading */}
      <Appbar.Header style={styles.appbars}>
        <Appbar.Action icon="home" color="#fff" />
        <Appbar.Content
          title="Reservation"
          titleStyle={{
            color: colors.white,
            fontFamily: "sans-serif",
            fontWeight: "bold",
          }}
        />
      </Appbar.Header>
      <ScrollView style={styles.contain} >
      <View style={styles.contain}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        {/* Filter Button */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleModal}
          activeOpacity={0.8}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
        {/* Modal acting as a bottom drawer */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Filter Patients</Text>

                {/* Filter Options */}
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

                {/* Clear Filters Button */}
                <Button
                  title="Clear Filters"
                  onPress={clearFilters}
                  color={colors.red}
                />
                {/* Close Modal */}
                <Button title="Close" onPress={toggleModal} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* Data Table */}
        <ScrollView
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <DataTable style={styles.dataTable}> */}
            <DataTable style={styles.dataTable}>
              {/* <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title style={[styles.cell1, styles.tableHeaderCell]}>
                  Patient ID
                </DataTable.Title>
                <DataTable.Title style={[styles.cell2, styles.tableHeaderCell]}>
                  Name
                </DataTable.Title>
                <DataTable.Title style={[styles.cell2, styles.tableHeaderCell]}>
                  Location
                </DataTable.Title>
                <DataTable.Title style={[styles.cell, styles.tableHeaderCell]}>
                  Appointment Date
                </DataTable.Title>
              </DataTable.Header> */}
              <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title style={styles.cell1}>
                  Patient ID
                </DataTable.Title>
                <DataTable.Title style={styles.cell}>Name</DataTable.Title>
                <DataTable.Title style={styles.cell2}>Location</DataTable.Title>
                <DataTable.Title style={styles.cell3}>
                  Appointment Date
                </DataTable.Title>
              </DataTable.Header>

              {/* Render the rows with expand/collapse functionality */}
              {renderPatientRows()}
            </DataTable>
          </ScrollView>
        </ScrollView>
        
      </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: colors.blue, // Apply color here
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8, // Rounded corners
    alignItems: "center",
    marginBottom: 10, // Adjust margins
  },
  filterButtonText: {
    color: colors.white, // Text color
    fontSize: 16, // Adjust font size
    fontWeight: "bold", // Optional: make the text bold
  },
  searchInput: {
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 10,
  },
  expandedView: {
    padding: 10,
    backgroundColor: colors.expandedRowBackground,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  appbars: {
    backgroundColor: "#008080",
    color: colors.white,
  },
  contain: {
    padding: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Adjust based on your desired layout
    marginTop: 10,
  },
  tableHeader: {
    backgroundColor: colors.lightblue,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  tableRow: {
    backgroundColor: colors.lightgray, // Row background color
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2, // Optional: adds a bottom border to each row
    borderColor: colors.gray,
    textAlign: "center",
  },
  //name
  cell: {
    flexGrow: 1, // Allows the cell to grow based on its content
    justifyContent: "center", // Center the text horizontally
    alignItems: "center", // Center the text vertically
    minWidth: 80, // Set a reasonable minimum width for columns
  },
  //location
  cell2: {
    flexGrow: 1, // Allows the cell to grow based on its content
    justifyContent: "center", // Center the text horizontally
    alignItems: "center", // Center the text vertically
    minWidth: 80, // Set a reasonable minimum width for columns
    marginLeft: -20,
  },
  //pid
  cell1: {
    flexGrow: 1, // Allows the cell to grow based on its content
    justifyContent: "center", // Center the text horizontally
    alignItems: "center", // Center the text vertically
    minWidth: 53, // Set a reasonable minimum width for columns
    marginLeft: -10,
  },
  //date
  cell3: {
    flexGrow: 1, // Allows the cell to grow based on its content
    justifyContent: "center", // Center the text horizontally
    alignItems: "center", // Center the text vertically
    minWidth: 90, // Set a reasonable minimum width for columns
    marginLeft: -5,
  },
  expandedView: {
    padding: 10,
    backgroundColor: colors.expandedRowBackground,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  dataTable: {
    width: "100%", // Reduce width to 95% of screen
  },
  // expandedView: {
  //   padding: 12,
  //   backgroundColor: colors.lightblue, // Add a background color for better visibility
  //   borderBottomWidth: 1,
  //   borderColor: colors.border,
  //   borderRadius: 8, // Add some rounding to the corners
  //   marginTop: 5, // Add some space between rows
  // },
  patientDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: colors.darkGray,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton1: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.blue, // Button background color
    // borderColor: colors.gray, // Border color
    // borderWidth: 1, // Border thickness
  },
  actionButton2: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.red, // Button background color
    // borderColor: colors.gray, // Border color
    // borderWidth: 1, // Border thickness
  },
  actionText: {
    marginRight: 5,
    color: colors.darkGray,
    fontWeight: "bold",
  },
});

export default PatientMasterSheet;
