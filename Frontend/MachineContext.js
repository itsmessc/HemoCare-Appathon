import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { ip } from "./constants/variables";

// Set up the socket connection
const socket = io(ip);

// Create a context
export const MachineContext = createContext();

// Create a provider component
export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState({});
  const [appointment, setappointment] = useState({});

  useEffect(() => {
    // Fetch initial machine data from the backend
    fetch(`${ip}/machine/getdetails`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming data is structured with locations as keys
        setMachines(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
    // Handle successful connection
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    fetch(`${ip}/appointment/reservations`)
      .then((response) => response.json())
      .then((data) => {
        setappointment(data);
      })
      .catch((error) => console.error("Error fetching data:", error));

    socket.on("appointmentreservation", (appointment) => {
      console.log("Appointment reservation received:", appointment);
      setappointment((prevappoint) => {
        return [
          ...prevappoint.filter((item) => item._id !== appointment._id), // Filter out the item with the same _id
          appointment, // Add the new appointment to the end
        ];
      });
    });

    socket.on("cancelreser",(id)=>{
      setappointment((prevappoint) => {
        return prevappoint.filter((item) => item._id !== id); 
      });
    })

    // Handle receiving machine data
    socket.on("machineUpdate", (machine) => {
      //console.log("Machine update received:", machine);
      //console.log("Current machines state:", machines);
      // Update state based on the new machine data
      setMachines((prevMachines) => {
        const { location } = machine; // Extract the location from the machine object
        return {
          ...prevMachines,
          [location]: prevMachines[location]
            ? prevMachines[location]
                .filter((item) => item._id !== machine._id) // Remove the old machine with the same _id
                .concat(machine) // Add the updated machine
            : [machine], // If location does not exist, initialize with the updated machine
        };
      });
    });
    // Handle connection errors
    socket.on("connect_error", (error) => {
      console.error("Connection Error:", error);
    });
    // Cleanup WebSocket handlers
    return () => {
      socket.off("connect");
      socket.off("machineUpdate");
      socket.off("connect_error");
    };
  }, []);

  return (
    <MachineContext.Provider value={{ machines, setMachines, appointment }}>
      {children}
    </MachineContext.Provider>
  );
};
