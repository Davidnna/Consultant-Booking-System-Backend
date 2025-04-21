const mongoose = require('mongoose');

const paymentCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false }
});

module.exports = mongoose.model('PaymentCode', paymentCodeSchema);