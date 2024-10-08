// import React, { useState, useEffect,useContext } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity,Alert } from 'react-native';
// import moment from 'moment'; // Ensure you have moment.js installed
// import colors from '../constants/colors';
// // import { ip } from '../constants/variables';
// import Constants from "expo-constants";
// const ip = Constants.expoConfig.extra.ip;
// import axios from 'axios';
// import {MachineContext} from '../MachineContext';



// const MachinePrep = ({navigation, machine, reservations }) => {
//   const [notes, setnotes] = useState('');
// const [showNotes, setShowNotes] = useState(false);
//   const {appointments} = useContext(MachineContext);

//   useEffect(() =>{
//     const notes = () =>{
//       const app = appointments.filter((app) => app._id === machine.appointment_id);
//       setnotes(app.length > 0 ? app[0].notes : '');
      
//     }
//     notes()
//   },[])

//   const [expanded, setExpanded] = useState(false);

//   // Get current time
//   const currentTime = moment();

//   // Sort reservations by start_time
//   const sortedReservations = [...reservations].sort((a, b) => {
//     const dateA = new Date(a.start_time);
//     const dateB = new Date(b.start_time);
//     return dateA - dateB;
//   });

//   const handleToggle = () => {
//     setExpanded(!expanded);
//   };

  

//   const handleCancel = (id) => {
//     Alert.alert(
//       'Confirm Cancellation',
//       'Are you sure you want to cancel this appointment?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'OK',
//           onPress: async () => {
//             try {
//               await axios.delete(`${ip}/appointment/cancelappointment/${id}`);
//               Alert.alert('Cancel Appointment', 'Appointment has been canceled successfully.');
//             } catch (err) {
//               console.error('Error canceling appointment:', err);
//               Alert.alert('Cancel Appointment', `Failed to cancel appointment with ID: ${id}. Please try again later.`);
//             }
//           },
//         },
//       ],
//       { cancelable: false }
//     );
//   };
// const startmachine = async () => {
//     try{
//         console.log(machine._id+"Hell YEah");
        
//         const response = await axios.post(`${ip}/machine/startmachine`,{machine_id:machine._id} );
//         console.log("MSN sent",response.data);
//     }
//     catch (error){
//         console.log("error",error);
//     }
// }



//   return (
//     <View style={styles.container}>
//       <View style={styles.infoContainer}>
//         <Text style={styles.machineText}>MSN: {machine.manufacturing_serial_number}</Text>
//         <Text style={styles.statusText}>Status: {machine.status}</Text>
//       </View>
//       <View style={styles.actionsContainer}>
//         <TouchableOpacity style={styles.button} onPress={startmachine}>
//           <Text style={styles.buttonText}>Start</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button,{backgroundColor:"red"}]} onPress={()=>handleCancel(machine.appointment_id)}>
//           <Text style={styles.buttonText}>Cancel</Text>
//         </TouchableOpacity>
//         {/* {reservations.length > 0 && (
//           <TouchableOpacity onPress={handleToggle} style={styles.reservationToggle}>
//             <Text style={styles.reservationText}>
//               {expanded ? 'Hide Reservations' : 'Show Reservations'}
//             </Text>
//           </TouchableOpacity>
//         )} */}
//       </View>
//       {/* {expanded && reservations.length > 0 && (
//         <View style={styles.reservationsContainer}>
//           {sortedReservations.map((reservation, index) => {
//             const startTime = moment(reservation.start_time);
//             const isAppointmentTime = currentTime.isSameOrAfter(startTime, 'minute') && currentTime.isBefore(startTime.clone().add(1, 'minute'));

//             return (
//               <View key={index} style={styles.reservation}>
//                 <Text>Patient ID: {reservation.patient_id}</Text>
//                 <Text>Start Time: {startTime.format("DD/MM/yyyy  HH:mm:ss")}</Text>
//                 <Text>End Time: {moment(reservation.end_time).format("DD/MM/yyyy  HH:mm:ss")}</Text>
//                 {isAppointmentTime && (
//                   <View style={styles.buttonContainer}>
//                     <TouchableOpacity style={styles.startButton} onPress={() => handleStart(reservation)}>
//                       <Text style={styles.startButtonText}>Start</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(reservation._id)}>
//                       <Text style={styles.cancelButtonText}>Cancel</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             );
//           })}
//         </View>
//       )} */}
//       <View style={styles.notesContainer}>
//         <TouchableOpacity 
//           style={styles.notesButton} 
//           onPress={() => setShowNotes((prev) => !prev)}
//         >
//           <Text style={styles.notesButtonText}>
//             {showNotes ? 'Hide Notes' : 'Show Notes'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {showNotes && (
//         <View style={styles.notesDisplay}>
//           <Text>{notes}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     marginHorizontal: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//     marginBottom: 10,
//     marginTop: 2,
//   },
//    notesContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   notesButton: {
//     backgroundColor: 'transparent', // No background
//     padding: 5,
//     marginTop: -8,
//   },
//   notesButtonText: {
//     color: colors.teal, // Change color as needed
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   notesDisplay: {
//     marginTop: 5,
//     padding: 5,
//     borderTopWidth: 1,
//     borderTopColor: '#E0E0E0',
//   },
//   cancelbutton: {
//     backgroundColor: 'red', // No background
//     padding: 5,
//     borderRadius:5
//   },
//   cancelbuttonte: {
//     color: colors.white, // Change color as needed
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   infoContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   machineText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//   },
//   statusText: {
//     fontSize: 14,
//     color: colors.prep,
//     fontWeight: 'bold',
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   button: {
//     backgroundColor: colors.teal,
//     borderRadius: 4,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   reservationToggle: {
//     marginLeft: 10,
//   },
//   reservationText: {
//     color: '#007BFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   reservationsContainer: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: '#F9F9F9',
//     borderRadius: 5,
//   },
//   reservation: {
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   startButton: {
//     backgroundColor: '#28a745', // Green color for the Start button
//     borderRadius: 4,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginRight: 10,
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#dc3545', // Red color for the Cancel button
//     borderRadius: 4,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//   },
//   startButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   cancelButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default MachinePrep;
import React, { useState, useEffect,useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import moment from 'moment'; // Ensure you have moment.js installed
import colors from '../constants/colors';
// import { ip } from '../constants/variables';
import Constants from "expo-constants";
const ip = Constants.expoConfig.extra.ip;
import axios from 'axios';
import {MachineContext} from '../MachineContext';



const MachinePrep = ({navigation, machine, reservations }) => {
  const [notes, setnotes] = useState('');
const [showNotes, setShowNotes] = useState(false);
  const {appointments} = useContext(MachineContext);

  useEffect(() =>{
    const notes = () =>{
      const app = appointments.filter((app) => app._id === machine.appointment_id);
      setnotes(app.length > 0 ? app[0].notes : '');
      
    }
    notes()
  },[])

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
const startmachine = async () => {
    try{
        console.log(machine._id+"Hell YEah");
        
        const response = await axios.post(`${ip}/machine/startmachine`,{machine_id:machine._id} );
        console.log("MSN sent",response.data);
    }
    catch (error){
        console.log("error",error);
    }
}



  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.machineText}>MSN: {machine.manufacturing_serial_number}</Text>
        <Text style={styles.statusText}>Status: {machine.status}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button} onPress={startmachine}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{backgroundColor:"red"}]} onPress={()=>handleCancel(machine.appointment_id)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        {/* {reservations.length > 0 && (
          <TouchableOpacity onPress={handleToggle} style={styles.reservationToggle}>
            <Text style={styles.reservationText}>
              {expanded ? 'Hide Reservations' : 'Show Reservations'}
            </Text>
          </TouchableOpacity>
        )} */}
      </View>
      {/* {expanded && reservations.length > 0 && (
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
      )} */}
      <View style={styles.notesContainer}>
        <TouchableOpacity 
          style={styles.notesButton} 
          onPress={() => setShowNotes((prev) => !prev)}
        >
          <Text style={styles.notesButtonText}>
            {showNotes ? 'Hide Notes' : 'Show Notes'}
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
    marginBottom: 10,
    marginTop: 2,
  },
   notesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  notesButton: {
    backgroundColor: 'transparent', // No background
    padding: 5,
    marginTop: -8,
  },
  notesButtonText: {
    color: colors.teal, // Change color as needed
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
    backgroundColor: 'red', // No background
    padding: 5,
    borderRadius:5
  },
  cancelbuttonte: {
    color: colors.white, // Change color as needed
    fontSize: 14,
    fontWeight: '600',
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
    color: colors.prep,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.teal,
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

export default MachinePrep;
