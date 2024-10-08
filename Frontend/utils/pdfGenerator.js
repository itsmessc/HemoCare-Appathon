import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import {useState} from 'react'
import Constants from "expo-constants";
const ip = Constants.expoConfig.extra.ip;
export const generatePDF = async (appointments) => {
  console.log(appointments);
  if (!appointments.length) {
    Alert.alert('No Appointments', 'There are no appointments to generate a report.');
    return;
  }

  const htmlContent = `
    <html>
  <head>
    <style>
    @page {
            size: A4 landscape; 
            margin: 20mm;
          }
      body { font-family: Arial, sans-serif; margin: 20px; }
      h1 { color: #4CAF50; }
      table { width: 100%; border-collapse: collapse; table-layout: fixed; }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
        overflow: hidden; 
        white-space: nowrap; 
        text-overflow: ellipsis;  
      }
      th { background-color: #f2f2f2; }
      th:nth-child(1) { width: 10%; }
      th:nth-child(2) { width: 10%; }
      th:nth-child(3) { width: 25%; } 
      th:nth-child(4) { width: 25%; } 
      th:nth-child(5) { width: 10%; } 
      th:nth-child(6) { width: 20%; } 
    </style>
  </head>
  <body>
    <h1>Appointment Report</h1>
    <table>
      <tr>
        <th>PID</th>
        <th>MID</th>
        <th>Start Time</th>
        <th>End Time</th>
        <th>Type</th>
        <th>Note</th>
      </tr>
      ${appointments
        .map(appointment => `
          <tr>
            <td>${appointment.patient_id}</td>
            <td>${appointment.machine_id?.manufacturing_serial_number || 'N/A'}</td>
            <td>${new Date(appointment.start_time).toLocaleString()}</td>
            <td>${new Date(appointment.end_time).toLocaleString()}</td>
            <td>${appointment.type}</td>
            <td>${appointment.notes}</td>
          </tr>
        `)
        .join('')}
    </table>
  </body>
</html>

  `;
  const simpleHtmlContent = `
  <html>
    <body>
      <h1>Test PDF</h1>
      <p>This is a test.</p>
    </body>
  </html>`;
  // await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 100ms
          appointments=null;
  try {
    // Generate the PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      fileName: 'TempAppointmentReport', // Initial temporary name
      base64: false,
    });

    console.log('PDF generated at:', uri);

    // Set the new file path with the custom name
    const newFilePath = `${FileSystem.documentDirectory}AppointmentReport.pdf`;
 
    // Move and rename the file
    await FileSystem.moveAsync({
      from: uri,
      to: newFilePath,
    });

    console.log('PDF moved to:', newFilePath);

    // Display an alert to show the new path or offer options for further actions
    Alert.alert('PDF Generated', `PDF saved at: ${newFilePath}`, [
      {
        text: 'Open PDF',
        onPress: async () => {
          // Open the generated PDF
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(newFilePath);
          } else {
            console.warn('Sharing is not available on this device.');
          }
        },
      },
      { text: 'OK' },
    ]);
  } catch (error) {
    console.error('Error generating or moving PDF:', error);
    Alert.alert('Error', 'An error occurred while generating the PDF.');
  }
};
