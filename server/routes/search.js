const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { search } = require('../controllers/searchController');
const { getTimeline } = require('../controllers/timelineController');

router.get('/search', protect, search);
router.get('/timeline', protect, getTimeline);

module.exports = router;
