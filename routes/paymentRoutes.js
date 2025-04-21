const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/authMiddleware');
const { verifyPaymentCode, createPaymentCode } = require('../controllers/paymentController');

// User submits payment code
router.post('/verify', auth, verifyPaymentCode);

// Admin creates payment codes
router.post('/create', auth, adminOnly, createPaymentCode);

module.exports = router;