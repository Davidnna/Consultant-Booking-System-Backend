const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: { type: String, required: true },
  slots: [String], // e.g. ['08:00', '08:30', ...]
});

const consultantProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialties: [String],
  pricing: { type: Number, required: true },
  availability: [availabilitySchema],
});

module.exports = mongoose.model('ConsultantProfile', consultantProfileSchema);