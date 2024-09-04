const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
  manufacturing_serial_number: { type: String, required: true },
  machine_type: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true, enum: ['Vacant', 'Occupied', 'Maintenance', 'Under Repair'] }, 
  start_time: { type: Date },
  end_time: { type: Date},
  patient_id:{type:String}
},{timestamps:true});

module.exports = mongoose.model('Machine', MachineSchema);
