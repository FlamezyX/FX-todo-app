const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getStats } = require('../controllers/statsController');

router.get('/', protect, getStats);

module.exports = router;
