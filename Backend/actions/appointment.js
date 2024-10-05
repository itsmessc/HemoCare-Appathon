const Appointment = require('../models/appointment.js');
const Machine = require('../models/machine.js')
const cron = require('node-cron');
const OneSignal = require('onesignal-node');
const client = new OneSignal.Client('25d4fd08-24db-4109-8f17-440d23a9a89e','NDcxNjFlZjktOWU2OS00NjIxLTgxZDAtNjhkMDMxMzJkNThm');

function dayIndex(day) {
  const days = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  };
  return days[day];
}
exports.addappointment = async (req, res) => {

  try {
    console.log(req.body);
    const { recurring } = req.body; // Extract recurring from req.body

    console.log("CHECKING VALUE" + recurring.enabled);
    
    if (recurring && recurring.enabled) {
      console.log("GAYYYYYYYYY");
      const daysOfWeek = recurring.days; // Get selected days for recurring appointments

        const startDate = new Date(req.body.start_time);
        const endDate = new Date(req.body.end_time);

        // Get the current date
        const currentDate = new Date();

        // Calculate the end date (1 month from now)
        const endOfMonth = new Date();
        endOfMonth.setMonth(currentDate.getMonth() + 1);
        console.log("Month"+endOfMonth);
        console.log("Current Date"+daysOfWeek);
        // Create appointments for each selected day within the next month
        for (let day of daysOfWeek) {
          let nextOccurrence = new Date(startDate);
          nextOccurrence.setDate(nextOccurrence.getDate() + ((7 + (dayIndex(day) - nextOccurrence.getDay())) % 7));

          while (nextOccurrence <= endOfMonth) {
            // Set appointment times based on the selected days
            const newStartTime = new Date(nextOccurrence);
            const newEndTime = new Date(nextOccurrence);
            newStartTime.setHours(startDate.getHours());
            newStartTime.setMinutes(startDate.getMinutes());
            newEndTime.setHours(endDate.getHours());
            newEndTime.setMinutes(endDate.getMinutes());

            // Create the appointment
            const appointment = await Appointment.create({
              patient_id: req.body.patient_id,
              start_time: newStartTime.toISOString(),
              end_time: newEndTime.toISOString(),
              duration: req.body.duration,
              machine_id: req.body.machine_id,
              notes: req.body.notes,
              type: req.body.type,
              staff_id: req.body.staff_id,
            });

            if (req.body.type !== "Reservation") {
              const machineUpdateResult = await Machine.updateOne(
                { _id: req.body.machine_id },
                {
                  $set: {
                    status: 'Preparing',
                    start_time: newStartTime,
                    end_time: newEndTime,
                    patient_id: req.body.patient_id,
                    appointment_id: appointment._id,
                  },
                }
              );

              if (machineUpdateResult.modifiedCount === 0) {
                throw new Error('Machine status update failed or machine not found');
              }
            }

            // Move to the next occurrence of the selected day
            nextOccurrence.setDate(nextOccurrence.getDate() + 7);
          }
        }
      } else {

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
    }
  
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

async function sendnoti (head,content){
  const notification = {
    app_id: '25d4fd08-24db-4109-8f17-440d23a9a89e', // Your OneSignal App ID
    contents: { en: content }, // Notification message
    included_segments: ["All"], // Send to all users
    headings: { en: head }, // Notification title
  };

  try {
    const response = await client.createNotification(notification);
    console.log('Notification sent successfully to all users:', response);
    // return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error sending notification to all users:', error);
    // return res.status(500).json({ success: false, error: error.message });
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

        
        const currentTime = new Date();
        const fifteenMinutesAgo = new Date(currentTime.getTime() + 15 * 60000); // 15 minutes ago
        const thirteenMinutesAgo = new Date(currentTime.getTime() + 13 * 60000); // 13 minutes ago
        
        const appointments = await Appointment.find({
          end_time: {
            $lte: fifteenMinutesAgo,
            $gte: thirteenMinutesAgo
          },
          notified:null
        });
        if(appointments){
          for(const ap of appointments){
            const machine = await Machine.findById(ap.machine_id);
            cont='PatientId:'+ap.patient_id+'\nLocation:'+machine.location+'\nMSN:'+machine.manufacturing_serial_number;
            head='Time Alert: 15min left';
            sendnoti(head,cont)
            await Appointment.findByIdAndUpdate(ap._id, { notified:'True'});
          }
        }

        
    } catch (error) {
        console.error('Error running cron job:', error);
    }
});

