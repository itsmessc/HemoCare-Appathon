import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import moment from 'moment'; 
import { MachineContext } from '../MachineContext';
import colors from '../constants/colors';
import axios from 'axios';
import { ip } from '../constants/variables';

const MachineOcc = ({ machine }) => {
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState('N/A');
  const { appointments } = useContext(MachineContext);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const calculateProgress = () => {
    if (!machine.start_time || !machine.end_time) return 0;

    const startTime = moment(machine.start_time);
    const endTime = moment(machine.end_time);
    const now = moment();

    const totalDuration = endTime.diff(startTime);
    const elapsedTime = now.diff(startTime);

    if (now.isAfter(endTime)) return 1;

    return Math.min(elapsedTime / totalDuration, 1);
  };

  const formatRemainingTime = () => {
    if (!machine.end_time) return 'N/A';

    const endTime = moment(machine.end_time);
    const now = moment();
    const remainingDuration = endTime.diff(now);

    if (remainingDuration < 0) return 'Completed';

    return moment.utc(remainingDuration).format('HH:mm:ss');
  };

  const handleCancel = (id) => {
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await axios.delete(`${ip}/appointment/cancelappointment/${id}`);
              Alert.alert('Cancel Appointment', 'Appointment has been canceled successfully.');
            } catch (err) {
              console.error('Error canceling appointment:', err);
              Alert.alert('Cancel Appointment', `Failed to cancel appointment with ID: ${id}. Please try again later.`);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const updateMachineStatus = () => {
      setProgress(calculateProgress());
      setRemainingTime(formatRemainingTime());
    };
    updateMachineStatus();

    const interval = setInterval(updateMachineStatus, 1000);
    return () => clearInterval(interval);
  }, [machine]);

  useEffect(() => {
    const notif = () => {
      const app = appointments.filter((app) => app._id === machine.appointment_id);
      setNotes(app.length > 0 ? app[0].notes : '');
    };
    notif();
  }, [appointments, machine]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.machineText}>
          MSN: {machine.manufacturing_serial_number} Patient Id: {machine.patient_id}
        </Text>
        <Text style={styles.timeText}>
          {remainingTime} Left
        </Text>
      </View>

      <Progress.Bar
        progress={progress}
        width={null}
        height={10}
        color="#4B70F5"
        unfilledColor="#E0E0E0"
        borderWidth={0}
        style={styles.progressBar}
      />

      {/* Notes Toggle Button */}
      <View style={styles.notesContainer}>
        <TouchableOpacity 
          style={styles.notesButton} 
          onPress={() => setShowNotes((prev) => !prev)}
        >
          <Text style={styles.notesButtonText}>
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cancelbutton} 
          onPress={() => handleCancel(machine.appointment_id)}
        >
          <Text style={styles.cancelbuttonte}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>

      {showNotes && (
        <View style={styles.notesDisplay}>
          <Text>{notes}</Text>
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
    height: 'auto',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  machineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    marginTop: 5,
  },
  notesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  notesButton: {
    backgroundColor: 'transparent',
    padding: 5,
  },
  notesButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: '600',
  },
  notesDisplay: {
    marginTop: 5,
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelbutton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  cancelbuttonte: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MachineOcc;
