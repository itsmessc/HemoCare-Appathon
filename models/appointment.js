const mongoose = require('mongoose');
const Patient=require('./patient');
const AppointmentSchema = new mongoose.Schema({
  patient_id: { 
    type: String, 
    required: true,
    validate: {
      validator: async function(v) {
        const patient = await Patient.findOne({ patient_id: v });
        return !!patient;
      },
      message: props => `Patient with ID ${props.value} does not exist!`
    }
  },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  duration: { type: Number, required: true },
  machine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
  notes: { type: String },
  type:{type:String,enum:["Reservation","Regular"]},
  staff_id:{type:String}
},{timestamps:true});

module.exports = mongoose.model('Appointment', AppointmentSchema);
