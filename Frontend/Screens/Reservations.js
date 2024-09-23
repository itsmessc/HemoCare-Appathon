import React, { useState, useEffect, useContext,useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MachineContext } from '../MachineContext';
import moment from 'moment';
import axios from 'axios';
import { ip } from '../constants/variables';

const Reservations = ({navigation}) => {
  const { appointment } = useContext(MachineContext);
  const [search, setSearch] = useState('');
  const [filteredReservations, setFilteredReservations] = useState([]);

  useLayoutEffect(() => {
    const headerTitle = `Reservations`;

    navigation.setOptions({
      title: headerTitle,
      headerStyle: {
        backgroundColor: "#4B70F5", // Example color, adjust as needed
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, []);
  // Filter reservations by patient_id
  useEffect(() => {
    if (search) {
      setFilteredReservations(
        appointment.filter(reservation =>
          reservation.patient_id === search
        )
      );
    } else {
      setFilteredReservations(appointment);
    }
  }, [search, appointment]);

  const handleStart = (id) => {
    // Implement start logic here
    Alert.alert('Start Appointment', `Starting appointment with ID: ${id}`);
  };

  const handleCancel = async (id) => {
    try {
        // Make a DELETE request to cancel the appointment
        await axios.delete(`${ip}/appointment/cancelappointment/${id}`);

        // Show an alert after a successful cancellation
        Alert.alert('Cancel Appointment', `Appointment has been canceled successfully.`);
    } catch (err) {
        // Log the error and show an alert with error information
        console.error('Error canceling appointment:', err);
        Alert.alert('Cancel Appointment', `Failed to cancel appointment with ID: ${id}. Please try again later.`);
    }
};

  const renderReservationItem = ({ item }) => {
    const startTime = moment(item.start_time);
    const isAppointmentTime = moment().isSameOrAfter(startTime, 'minute') && moment().isBefore(startTime.clone().add(1, 'minute'));

    return (
      <View style={styles.reservationItem}>
        <Text style={styles.text}>Patient ID: {item.patient_id}</Text>
        <Text style={styles.text}>Start Time: {startTime.format("DD/MM/yyyy HH:mm:ss")}</Text>
        <Text style={styles.text}>End Time: {moment(item.end_time).format("DD/MM/yyyy HH:mm:ss")}</Text>
        {isAppointmentTime && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={() => handleStart(item._id)}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item._id)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )} 
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by patient ID"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredReservations}
        keyExtractor={item => item._id}
        renderItem={renderReservationItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 10,
  },
  reservationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  startButton: {
    backgroundColor: '#28a745',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Reservations;
