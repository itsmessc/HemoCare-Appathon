const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  phone: { type: String, required: true },
  blood_group: { type: String },
  password:{
    type:String,
    required:true
  }
},{timestamps:true});

module.exports = mongoose.model('Staff', StaffSchema);
