const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getProfile, updateProfile, changePassword, updatePreferences } = require('../controllers/settingsController');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.put('/preferences', updatePreferences);

module.exports = router;
