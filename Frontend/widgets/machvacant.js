import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment'; // Ensure you have moment.js installed

const MachineVacant = ({navigation, machine, reservations }) => {
  const [expanded, setExpanded] = useState(false);

  // Get current time
  const currentTime = moment();

  // Sort reservations by start_time
  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(a.start_time);
    const dateB = new Date(b.start_time);
    return dateA - dateB;
  });

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleStart = (reservation) => {
    // Implement start logic here
    alert(`Starting appointment for Patient ID: ${reservation.patient_id}`);
  };

  const handleCancel = async (id) => {
    try {
        // Make a DELETE request to cancel the appointment
        await axios.delete(`https://appathon-backend.onrender.com/appointment/cancelappointment/${id}`);

        // Show an alert after a successful cancellation
        Alert.alert('Cancel Appointment', `Appointment has been canceled successfully.`);
    } catch (err) {
        // Log the error and show an alert with error information
        console.error('Error canceling appointment:', err);
        Alert.alert('Cancel Appointment', `Failed to cancel appointment with ID: ${id}. Please try again later.`);
    }
};
const onaddappoint = () => {
  navigation.navigate("Form",{machine});
}

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.machineText}>MSN: {machine.manufacturing_serial_number}</Text>
        <Text style={styles.statusText}>Status: Vacant</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button} onPress={onaddappoint}>
          <Text style={styles.buttonText}>Add Appointment</Text>
        </TouchableOpacity>
        {reservations.length > 0 && (
          <TouchableOpacity onPress={handleToggle} style={styles.reservationToggle}>
            <Text style={styles.reservationText}>
              {expanded ? 'Hide Reservations' : 'Show Reservations'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {expanded && reservations.length > 0 && (
        <View style={styles.reservationsContainer}>
          {sortedReservations.map((reservation, index) => {
            const startTime = moment(reservation.start_time);
            const isAppointmentTime = currentTime.isSameOrAfter(startTime, 'minute') && currentTime.isBefore(startTime.clone().add(1, 'minute'));

            return (
              <View key={index} style={styles.reservation}>
                <Text>Patient ID: {reservation.patient_id}</Text>
                <Text>Start Time: {startTime.format("DD/MM/yyyy  HH:mm:ss")}</Text>
                <Text>End Time: {moment(reservation.end_time).format("DD/MM/yyyy  HH:mm:ss")}</Text>
                {isAppointmentTime && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.startButton} onPress={() => handleStart(reservation)}>
                      <Text style={styles.startButtonText}>Start</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(reservation._id)}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
    marginTop: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  machineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusText: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  reservationToggle: {
    marginLeft: 10,
  },
  reservationText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '500',
  },
  reservationsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
  },
  reservation: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#28a745', // Green color for the Start button
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545', // Red color for the Cancel button
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MachineVacant;
