const User = require('../models/User');
const Booking = require('../models/Booking');
const ConsultantProfile = require('../models/ConsultantProfile');

exports.getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.json(users);
};

exports.getAllConsultants = async (req, res) => {
  const consultants = await User.find({ role: 'consultant' }).select('-password');
  res.json(consultants);
};

exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('consultant', 'name email');
  res.json(bookings);
};

exports.getAnalytics = async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalConsultants = await User.countDocuments({ role: 'consultant' });
  const totalBookings = await Booking.countDocuments();

  res.json({
    totalUsers,
    totalConsultants,
    totalBookings
  });
};