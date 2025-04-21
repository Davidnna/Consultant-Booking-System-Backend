const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  consultant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // e.g. "2025-04-21"
  startTime: { type: String, required: true }, // "14:00"
  duration: { type: Number, required: true }, // in minutes
  platform: { type: String, enum: ['Zoom', 'Google Meet', 'Skype'], required: true },
  meetingLink: { type: String },
  verified: { type: Boolean, default: false }, // tied to payment verification
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);