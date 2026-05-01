const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getNotifications, markAllRead, markRead, deleteNotification,
  getPreferences, updatePreferences,
} = require('../controllers/notificationsController');

router.use(protect);

// Static routes first to avoid /:id conflicts
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);
router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteNotification);

module.exports = router;
