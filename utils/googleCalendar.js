const { google } = require('googleapis');

const getOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

const createCalendarEvent = async ({ token, booking }) => {
  const auth = getOAuthClient();
  auth.setCredentials(token);

  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: `Consultation with ${booking.user.name}`,
    description: `Platform: ${booking.platform}\nLink: ${booking.meetingLink}`,
    start: {
      dateTime: new Date(`${booking.date}T${booking.startTime}:00`).toISOString(),
      timeZone: 'Africa/Lagos'
    },
    end: {
      dateTime: new Date(new Date(`${booking.date}T${booking.startTime}:00`).getTime() + booking.duration * 60000).toISOString(),
      timeZone: 'Africa/Lagos'
    },
    attendees: [{ email: booking.user.email }],
  };

  return calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });
};

module.exports = { getOAuthClient, createCalendarEvent };