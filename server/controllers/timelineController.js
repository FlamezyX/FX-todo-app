const pool = require('../config/db');

const getTimeline = async (req, res) => {
  const userId = req.user.id;
  const { filter = 'all', page = 1 } = req.query;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const events = [];

    if (filter === 'all' || filter === 'tasks') {
      const [tasks] = await pool.query(
        `SELECT id, title, status, priority, category, updated_at AS date, 'task' AS type
         FROM tasks WHERE user_id = ? AND status = 'completed'
         ORDER BY updated_at DESC LIMIT 50`,
        [userId]
      );
      events.push(...tasks);
    }

    if (filter === 'all' || filter === 'habits') {
      const [logs] = await pool.query(
        `SELECT hl.id, h.title, hl.completed_at AS date, 'habit' AS type, h.icon, h.color
         FROM habit_logs hl
         JOIN habits h ON hl.habit_id = h.id
         WHERE hl.user_id = ?
         ORDER BY hl.completed_at DESC LIMIT 50`,
        [userId]
      );
      events.push(...logs);
    }

    if (filter === 'all' || filter === 'goals') {
      const [goals] = await pool.query(
        `SELECT id, title, status, updated_at AS date, 'goal' AS type
         FROM goals WHERE user_id = ? AND status = 'completed'
         ORDER BY updated_at DESC LIMIT 20`,
        [userId]
      );
      events.push(...goals);
    }

    // Sort all events by date descending and paginate
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    const paginated = events.slice(offset, offset + limit);
    const total = events.length;

    res.json({ events: paginated, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTimeline };
