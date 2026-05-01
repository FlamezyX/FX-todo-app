const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getProfile } = require('../controllers/gamificationController');

router.get('/profile', protect, getProfile);

module.exports = router;
