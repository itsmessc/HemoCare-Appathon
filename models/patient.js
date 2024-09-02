const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  patient_id:{ type:String,required: true},
  name: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  patient_history: {
    previous_dialysis: { type: [String], default: [] },
    last_dialysis_date: { type: Date }
  },
  blood_group: { type: String, required: true },
  nextappointment:{
    date:{type:Date},
    time:{type:String}
  }
},{timestamps:true});

module.exports = mongoose.model('Patient', PatientSchema);
