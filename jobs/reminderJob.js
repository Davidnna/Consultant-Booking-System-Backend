const cron = require('node-cron');
const Booking = require('../models/Booking');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// Run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const inOneHour = new Date(now.getTime() + 60 * 60000);

  try {
    const bookings = await Booking.find({
      verified: true,
      reminderSent: { $ne: true },
      date: {
        $eq: now.toISOString().slice(0, 10) // match YYYY-MM-DD
      }
    });

    for (let booking of bookings) {
      const start = new Date(`${booking.date}T${booking.startTime}:00`);
      if (start >= now && start <= inOneHour) {
        const user = await User.findById(booking.user);
        const consultant = await User.findById(booking.consultant);

        const message = `
          <h3>⏰ Reminder: Your consultation is starting soon</h3>
          <p><b>Date:</b> ${booking.date}</p>
          <p><b>Time:</b> ${booking.startTime}</p>
          <p><b>Platform:</b> ${booking.platform}</p>
          <p><b>Meeting Link:</b> <a href="${booking.meetingLink}">${booking.meetingLink}</a></p>
        `;

        await sendEmail(user.email, 'Reminder: Your consultation is in 1 hour', message);
        await sendEmail(consultant.email, 'Reminder: You have a session in 1 hour', message);

        booking.reminderSent = true;
        await booking.save();
      }
    }
  } catch (err) {
    console.error('Reminder job error:', err.message);
  }
});