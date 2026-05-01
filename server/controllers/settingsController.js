const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
  try {
    const [[user]] = await pool.query(
      'SELECT id, username, email, avatar, xp, level, time_format, accent_color, notif_tasks, notif_habits, notif_goals, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) return res.status(400).json({ message: 'Username and email are required' });

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
      [username, email, req.user.id]
    );
    if (existing.length) return res.status(409).json({ message: 'Username or email already taken' });

    await pool.query('UPDATE users SET username=?, email=? WHERE id=?', [username, email, req.user.id]);
    const [[user]] = await pool.query(
      'SELECT id, username, email, avatar, xp, level FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'All fields are required' });
  if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

  try {
    const [[user]] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password=? WHERE id=?', [hashed, req.user.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePreferences = async (req, res) => {
  const { time_format, accent_color, notif_tasks, notif_habits, notif_goals } = req.body;
  try {
    await pool.query(
      'UPDATE users SET time_format=?, accent_color=?, notif_tasks=?, notif_habits=?, notif_goals=? WHERE id=?',
      [time_format, accent_color, notif_tasks, notif_habits, notif_goals, req.user.id]
    );
    res.json({ message: 'Preferences updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile, changePassword, updatePreferences };
