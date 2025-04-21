const express = require('express');
const { getOAuthClient, createCalendarEvent } = require('../utils/googleCalendar');
const { auth } = require('../middleware/authMiddleware');
const router = express.Router();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

router.get('/auth', auth, (req, res) => {
  const oauth2Client = getOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: req.user.id
  });
  res.json({ url });
});

router.get('/callback', async (req, res) => {
  const oauth2Client = getOAuthClient();
  const { code, state } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    // 🔐 Save tokens under user (MongoDB or Redis). For now, just log:
    console.log(`OAuth2 Tokens for User ID ${state}:`, tokens);

    res.send('Google Calendar connected successfully. You can close this tab.');
  } catch (err) {
    console.error('Google OAuth failed:', err.message);
    res.status(500).send('Auth Failed');
  }
});

module.exports = router;