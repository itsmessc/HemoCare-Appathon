import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import io from 'socket.io-client';

export default function App() {
  const [machineData, setMachineData] = useState(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('http://192.168.240.31:7878'); // Update the URL if necessary

    // Listen for connection
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    // Listen for machine updates
    socket.on('machineUpdate', (data) => {
      console.log('Machine update received:', data);
      setMachineData(data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.value}>{item.value}</Text>
    </View>
  );

  // Prepare data for the FlatList
  const machineDetails = machineData ? [
    { label: 'Machine Type:', value: machineData.machine_type },
    { label: 'Serial Number:', value: machineData.manufacturing_serial_number },
    { label: 'Location:', value: machineData.location },
    { label: 'Status:', value: machineData.status },
    { label: 'Last Updated:', value: new Date(machineData.updatedAt).toLocaleString() }
  ] : [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Machine Status Update</Text>
      {machineData ? (
        <FlatList
          data={machineDetails}
          renderItem={renderItem}
          keyExtractor={(item) => item.label}
        />
      ) : (
        <Text>Waiting for machine data...</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  value: {
    fontSize: 16,
    flex: 2,
  },
});
