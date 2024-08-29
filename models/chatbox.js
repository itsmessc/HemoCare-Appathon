const mongoose = require('mongoose');

const ChatboxSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now },
  content: { type: String, required: true },
  location: { type: String }
},{timestamps:true});

module.exports = mongoose.model('Chatbox', ChatboxSchema);
