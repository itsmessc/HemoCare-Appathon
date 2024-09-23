import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import moment from 'moment'; 

const MachineOcc = ({ machine }) => {
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState('N/A');

  // Helper function to calculate progress percentage
  const calculateProgress = () => {
    if (!machine.start_time || !machine.end_time) return 0;

    const startTime = moment(machine.start_time);
    const endTime = moment(machine.end_time);
    const now = moment(); // Current time

    // Calculate total duration
    const totalDuration = endTime.diff(startTime);
    // Calculate elapsed time
    const elapsedTime = now.diff(startTime);

    // If current time is after end time, set progress to 100%
    if (now.isAfter(endTime)) return 1;

    // Calculate the progress percentage
    return Math.min(elapsedTime / totalDuration, 1); // Ensure progress does not exceed 100%
  };

  // Helper function to format the remaining time
  const formatRemainingTime = () => {
    if (!machine.end_time) return 'N/A';

    const endTime = moment(machine.end_time);
    const now = moment();
    const remainingDuration = endTime.diff(now);

    // If time has passed, return 'Completed' or any message
    if (remainingDuration < 0) return 'Completed';

    return moment.utc(remainingDuration).format('HH:mm:ss');
  };

  useEffect(() => {
    // Calculate and set progress and remaining time
    const updateMachineStatus = () => {
      setProgress(calculateProgress());
      setRemainingTime(formatRemainingTime());
    };

    // Initial update
    updateMachineStatus();

    // Update every second
    const interval = setInterval(updateMachineStatus, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [machine]); // Depend on machine to re-calculate when machine changes

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.machineText}>MSN:{machine.manufacturing_serial_number}  Patient Id:{machine.patient_id}</Text>
        <Text style={styles.timeText}>
          {remainingTime} Left
        </Text>
      </View>
      {/* Progress Bar with calculated progress */}
      <Progress.Bar
        progress={progress}
        width={null} // Let the bar take the full width of the parent
        height={10}
        color="#4B70F5"
        unfilledColor="#E0E0E0"
        borderWidth={0}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#FFF', // Background color for the container
    borderRadius: 10, // Rounded corners to match the image style
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevation property for Android
    elevation: 5,
    height: 75,
    marginBottom:10
  },
  infoContainer: {
    flexDirection: 'row', // Arrange text in a row
    justifyContent: 'space-between', // Space out the text elements
    alignItems: 'center',
    marginBottom: 5, // Space between the text and progress bar
  },
  machineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000', // Black color for the text
  },
  timeText: {
    fontSize: 14,
    color: '#666', // Grey color for the time text
  },
  progressBar: {
    marginTop: 5,
  },
});

export default MachineOcc;
