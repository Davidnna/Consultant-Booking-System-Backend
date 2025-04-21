const ConsultantProfile = require('../models/ConsultantProfile');
const User = require('../models/User');

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { specialties, pricing, availability } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== 'consultant') return res.status(403).json({ msg: 'Unauthorized' });

    const profileData = { user: userId, specialties, pricing, availability };

    const profile = await ConsultantProfile.findOneAndUpdate(
      { user: userId },
      profileData,
      { upsert: true, new: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await ConsultantProfile.findOne({ user: req.params.id }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};