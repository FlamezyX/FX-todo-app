const pool = require('../config/db');

const search = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) return res.json({ tasks: [], goals: [], habits: [] });

  const term = `%${q.trim()}%`;
  const userId = req.user.id;

  try {
    const [tasks] = await pool.query(
      'SELECT id, title, status, priority, category FROM tasks WHERE user_id = ? AND title LIKE ? LIMIT 5',
      [userId, term]
    );
    const [goals] = await pool.query(
      'SELECT id, title, status FROM goals WHERE user_id = ? AND title LIKE ? LIMIT 5',
      [userId, term]
    );
    const [habits] = await pool.query(
      'SELECT id, title, frequency FROM habits WHERE user_id = ? AND title LIKE ? LIMIT 5',
      [userId, term]
    );

    res.json({ tasks, goals, habits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { search };
