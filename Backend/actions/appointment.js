const Appointment = require('../models/appointment.js');
const Machine = require('../models/machine.js')
const cron = require('node-cron');

exports.addappointment = async (req, res) => {
    try {
      console.log(req.body);
      
      // Create the appointment
      const appointment = await Appointment.create({
        patient_id: req.body.patient_id,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        duration: req.body.duration,
        machine_id: req.body.machine_id,
        notes: req.body.notes,
        type:req.body.type,
        staff_id:req.body.staff_id
      }).then(async (appoint)=>{
        if (req.body.type!=="Reservation"){
          const machineUpdateResult = await Machine.updateOne(
            { _id: req.body.machine_id },
            { $set: { status: 'Preparing' ,start_time: req.body.start_time, end_time: req.body.end_time,patient_id:req.body.patient_id,appointment_id:appoint._id} }
            
          );
          if (machineUpdateResult.modifiedCount === 0) {
            throw new Error('Machine status update failed or machine not found');
          }
      
        }
      }
        
      );
  
      // Update the machine status to 'Occupied'
      
  
      
      // Respond with success
      res.status(200).json({ status: 'Appointment added and machine marked as occupied' });
    } catch (err) {
      // Respond with error
      res.status(500).send('Error: ' + err.message);
    }
  };
  

exports.getappointments = async (req,res)=>{
  try{
    const appointments= await Appointment.find({type:"Reservation",start_time:{$gt: new Date()}});
    res.json(appointments);
  }
  catch(error){
    res.json({"error":error})
  }

}


exports.cancelappointment=async (req,res)=>{
  try{
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    await Machine.findByIdAndUpdate(appointment.machine_id,{
      status: 'Vacant',
      start_time: null,
      end_time: null,
      appointment_id:null
    })
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: 'Appointment cancelled successfully' });
  
  }
  catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
    
}


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
                end_time: null ,
                appointment_id:null
            }).then(()=>{console.log('Machine status updated to vacant',machine._id);});
        }
        const appointment = await Appointment.find({
          start_time: { $lt: new Date() },
          end_time: { $gt: new Date() }
        });
        
        for (const app of appointment) {
          const machine = await Machine.findById(app.machine_id);
          if (machine.status === 'Vacant') { // Check if the machine is vacant
            await Machine.findByIdAndUpdate(app.machine_id, {
              status: 'Preparing',
              start_time:app.start_time,
              end_time:app.end_time,
              appointment_id:app._id
            });
          }
        }
        
    } catch (error) {
        console.error('Error running cron job:', error);
    }
});

