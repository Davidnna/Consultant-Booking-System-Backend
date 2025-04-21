const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Consult Booking App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`📤 Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

module.exports = sendEmail;