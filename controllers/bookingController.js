const Booking = require('../models/Booking');
const ConsultantProfile = require('../models/ConsultantProfile');
const sendEmail = require('../utils/email');

exports.createBooking = async (req, res) => {
  const { consultantId, date, startTime, duration, platform, meetingLink } = req.body;
  const userId = req.user.id;

  try {
    // Get consultant's profile
    const profile = await ConsultantProfile.findOne({ user: consultantId });
    if (!profile) return res.status(404).json({ msg: 'Consultant not found' });

    // Conflict check
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + duration;

    const existing = await Booking.find({ consultant: consultantId, date });
    for (let b of existing) {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = bStart + b.duration;
      const overlap = Math.max(0, Math.min(endMinutes, bEnd) - Math.max(startMinutes, bStart));
      if (overlap > 0) {
        return res.status(409).json({ msg: 'Time slot already booked' });
      }
    }

    const booking = await Booking.create({
      consultant: consultantId,
      user: userId,
      date,
      startTime,
      duration,
      platform,
      meetingLink
    });

    const consultantUser = await User.findById(consultantId);
    const bookingUser = await User.findById(userId);
  
    const details = `
      <h2>Appointment Confirmed ✅</h2>
      <p><b>Consultant:</b> ${consultantUser.name}</p>
      <p><b>User:</b> ${bookingUser.name}</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Time:</b> ${startTime}</p>
      <p><b>Platform:</b> ${platform}</p>
      <p><b>Link:</b> <a href="${meetingLink}">${meetingLink}</a></p>
    `;
  
    await sendEmail(bookingUser.email, 'Your Appointment is Confirmed', details);
    await sendEmail(consultantUser.email, 'New Appointment Booked', details);
  
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper to convert HH:MM to minutes
const timeToMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

exports.getConsultantBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ consultant: req.params.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};