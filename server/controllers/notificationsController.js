const pool = require('../config/db');

const getNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30',
      [req.user.id]
    );
    const [[{ unread }]] = await pool.query(
      'SELECT COUNT(*) AS unread FROM notifications WHERE user_id = ? AND read_status = FALSE',
      [req.user.id]
    );
    res.json({ notifications: rows, unread: Number(unread) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const markAllRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET read_status = TRUE WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'All marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const markRead = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE notifications SET read_status = TRUE WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM notifications WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPreferences = async (req, res) => {
  try {
    const [[user]] = await pool.query(
      'SELECT notif_tasks, notif_habits, notif_goals FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePreferences = async (req, res) => {
  const { notif_tasks, notif_habits, notif_goals } = req.body;
  try {
    await pool.query(
      'UPDATE users SET notif_tasks=?, notif_habits=?, notif_goals=? WHERE id=?',
      [notif_tasks, notif_habits, notif_goals, req.user.id]
    );
    res.json({ message: 'Preferences updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getNotifications, markAllRead, markRead, deleteNotification, getPreferences, updatePreferences };
