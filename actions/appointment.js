const Appointment = require('../models/appointment.js')
const Machine = require('../models/machine.js')
const cron = require('node-cron');

exports.addappointment = async (req, res) => {
    try {
      // Create the appointment
      const appointment = await Appointment.create({
        patient_id: req.body.patient_id,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        duration: req.body.duration,
        machine_id: req.body.machine_id,
        notes: req.body.notes
      });
  
      // Update the machine status to 'Occupied'
      const machineUpdateResult = await Machine.updateOne(
        { _id: req.body.machine_id },
        { $set: { status: 'Occupied' ,start_time: req.body.start_time, end_time: req.body.end_time} }
      );
  
      if (machineUpdateResult.modifiedCount === 0) {
        throw new Error('Machine status update failed or machine not found');
      }
  
      // Respond with success
      res.status(200).json({ status: 'Appointment added and machine marked as occupied' });
    } catch (err) {
      // Respond with error
      res.status(500).send('Error: ' + err.message);
    }
  };
  

async function updateMachineStatusOnAppointmentEnd(appointmentId) {
    try {
      // Find the appointment
      const appointment = await Appointment.findById(appointmentId).populate('machine_id');
  
      if (!appointment) {
        throw new Error('Appointment not found');
      }
  
      // Check if the current time is past the end time of the appointment
      if (new Date() > new Date(appointment.end_time)) {
        // Update the machine's status to 'vacant'
        await Machine.findByIdAndUpdate(appointment.machine_id, { status: 'Vacant',start_time: null,
            end_time: null });
  
        console.log('Machine status updated to vacant');
      } else {
        console.log('Appointment has not ended yet');
      }
    } catch (error) {
      console.error('Error updating machine status:', error);
    }
  }

  cron.schedule('*/1 * * * *', async () => {
    try {
      
      const appointments = await Appointment.find({
        end_time: { $lt: new Date() },
      }).populate('machine_id');
  
      for (const appointment of appointments) {
        if (appointment.machine_id.status === 'Occupied') {
          await updateMachineStatusOnAppointmentEnd(appointment._id);
        }
      }
    } catch (error) {
      console.error('Error running cron job:', error);
    }
  });