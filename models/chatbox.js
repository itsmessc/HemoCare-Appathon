const mongoose = require('mongoose');

const ChatboxSchema = new mongoose.Schema({
  sender_id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  content: { type: String, required: true },
  location: { type: String }
},{timestamps:true});

module.exports = mongoose.model('Chatbox', ChatboxSchema);
