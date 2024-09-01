const Appointment = require('../models/appointment.js');
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
  



cron.schedule('*/1 * * * *', async () => {
  console.log('hello');
  
    try {
        const machines = await Machine.find({
          $or: [
              { end_time: { $lt: new Date() } },
              { end_time: { $eq: null } }
          ],
            status: 'Occupied' // Only update occupied machines
        });

        for (const machine of machines) {
            await Machine.findByIdAndUpdate(machine._id, { 
                status: 'Vacant', 
                start_time: null,
                end_time: null 
            });
        }
        console.log('Machine status updated to vacant');
    } catch (error) {
        console.error('Error running cron job:', error);
    }
});

