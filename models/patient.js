const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  preference: { type: String },
  patient_history: {
    previous_dialysis: { type: [String], default: [] },
    last_dialysis_date: { type: Date }
  },
  blood_group: { type: String, required: true }
},{timestamps:true});

module.exports = mongoose.model('Patient', PatientSchema);
