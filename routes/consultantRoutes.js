const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createOrUpdateProfile, getProfile } = require('../controllers/consultantController');

router.post('/profile', auth, createOrUpdateProfile);
router.get('/profile/:id', getProfile); // public view

module.exports = router;