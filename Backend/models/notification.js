const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  type_of_notification: { type: String, required: true },  // e.g., appointment reminder, machine availability
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'Unread' }  // Read, Unread, or Acknowledged
},{timestamps:true});

module.exports = mongoose.model('Notification', NotificationSchema);
