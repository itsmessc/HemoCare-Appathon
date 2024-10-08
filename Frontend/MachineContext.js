import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";
// import { ip } from "./constants/variables";
import Constants from "expo-constants";
const ip = Constants.expoConfig.extra.ip;

// Set up the socket connection
const socket = io(ip);

// Create a context
export const MachineContext = createContext();

// Create a provider component
export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState({});
  const [appointments, setAppointments] = useState({});
  const [availableLocations, setLocations] = useState([]);
  const [patients,setpatients]=useState([]);
  // Fetch initial machine data from the backend
  const fetchMachineData = async () => {
    try {
      const response = await fetch(`${ip}/machine/getdetails`);
      const data = await response.json();
      setMachines(data); // Store machine data
      setLocations(Object.keys(data)); // Extract locations from machine data
    } catch (error) {
      console.error("Error fetching machine data:", error);
    }
  };

  // Fetch initial appointment data from the backend
  const fetchAppointmentData = async () => {
    try {
      const response = await fetch(`${ip}/appointment/reservations`);
      const data = await response.json();
      setAppointments(data); // Store appointment data
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };
  const fetchPatientDetails = async () =>{
    try{
      const response= await fetch(`${ip}/patient/getdetails`);
      const data = await response.json();
      setpatients(data);

    } catch(error){
      console.error("Error fetching patient data:",error);
    }
    
  }
  useEffect(() => {
    // Fetch data once the component mounts
    fetchMachineData();
    fetchAppointmentData();
    fetchPatientDetails();
    // WebSocket connection for receiving machine updates
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    // Handle machine updates from WebSocket
    socket.on("machineUpdate", (machine) => {
      setMachines((prevMachines) => {
        const { location } = machine;
        return {
          ...prevMachines,
          [location]: prevMachines[location]
            ? prevMachines[location]
                .filter((item) => item._id !== machine._id)
                .concat(machine)
            : [machine],
        };
      });
    });
    socket.on("patientUpdate",(newp)=>{
      setpatients((prevPatients)=>{
        return [
          ...prevPatients.filter((item)=>item._id!==newp._id),
          newp,
        ];
      });
    })
    // Handle appointment updates from WebSocket
    socket.on("appointmentreservation", (newAppointment) => {
      setAppointments((prevAppointments) => {
        return [
          ...prevAppointments.filter((item) => item._id !== newAppointment._id),
          newAppointment,
        ];
      });
    });

    // Handle appointment cancellations from WebSocket
    socket.on("cancelreser", (appointmentId) => {
      setAppointments((prevAppointments) => {
        return prevAppointments.filter((item) => item._id !== appointmentId);
      });
    });

    // Handle connection errors
    socket.on("connect_error", (error) => {
      console.error("Connection Error:", error);
    });

    // Cleanup WebSocket handlers when the component unmounts
    return () => {
      socket.off("connect");
      socket.off("machineUpdate");
      socket.off("appointmentreservation");
      socket.off("cancelreser");
      socket.off("connect_error");
    };
  }, []);

  return (
    <MachineContext.Provider value={{ machines, appointments, availableLocations ,setMachines,patients}}>
      {children}
    </MachineContext.Provider>
  );
};
