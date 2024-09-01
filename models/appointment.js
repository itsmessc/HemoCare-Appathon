const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  duration: { type: Number, required: true },
  machine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
  notes: { type: String },
  type:{type:String,enum:["Reservation","Regular"]}
},{timestamps:true});

module.exports = mongoose.model('Appointment', AppointmentSchema);
