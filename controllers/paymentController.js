const PaymentCode = require('../models/PaymentCode');
const Booking = require('../models/Booking');

exports.verifyPaymentCode = async (req, res) => {
  const { code, bookingId } = req.body;

  try {
    const codeEntry = await PaymentCode.findOne({ code });

    if (!codeEntry) return res.status(400).json({ msg: 'Invalid code' });
    if (codeEntry.used) return res.status(400).json({ msg: 'Code already used' });

    await Booking.findByIdAndUpdate(bookingId, { verified: true });
    codeEntry.used = true;
    await codeEntry.save();

    res.json({ msg: 'Payment verified and booking confirmed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createPaymentCode = async (req, res) => {
  const { code } = req.body;

  try {
    const exists = await PaymentCode.findOne({ code });
    if (exists) return res.status(400).json({ msg: 'Code already exists' });

    await PaymentCode.create({ code });
    res.status(201).json({ msg: 'Code created successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};