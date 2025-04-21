const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createBooking, getConsultantBookings } = require('../controllers/bookingController');

router.post('/', auth, createBooking);
router.get('/:id', getConsultantBookings); // consultantId
module.exports = router;