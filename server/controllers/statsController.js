const pool = require('../config/db');

const getStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // Overall counts
    const [counts] = await pool.query(
      `SELECT
        COUNT(*) AS total,
        SUM(status = 'completed') AS completed,
        SUM(status = 'pending') AS pending,
        SUM(status = 'missed') AS missed
       FROM tasks WHERE user_id = ?`,
      [userId]
    );

    // Last 7 days completion trend
    const [trend] = await pool.query(
      `SELECT
        DATE(created_at) AS date,
        SUM(status = 'completed') AS completed,
        SUM(status = 'pending') AS pending
       FROM tasks
       WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [userId]
    );

    // Priority distribution
    const [priority] = await pool.query(
      `SELECT priority, COUNT(*) AS count FROM tasks WHERE user_id = ? GROUP BY priority`,
      [userId]
    );

    // Category breakdown
    const [category] = await pool.query(
      `SELECT category, COUNT(*) AS count FROM tasks WHERE user_id = ? GROUP BY category ORDER BY count DESC LIMIT 6`,
      [userId]
    );

    // Fill missing days in trend
    const trendMap = {};
    trend.forEach((r) => { trendMap[r.date] = r; });

    const filledTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      filledTrend.push({
        date: key,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: Number(trendMap[key]?.completed || 0),
        pending: Number(trendMap[key]?.pending || 0),
      });
    }

    res.json({
      counts: {
        total: Number(counts[0].total),
        completed: Number(counts[0].completed),
        pending: Number(counts[0].pending),
        missed: Number(counts[0].missed),
      },
      trend: filledTrend,
      priority: priority.map((p) => ({ name: p.priority, value: Number(p.count) })),
      category: category.map((c) => ({ name: c.category, count: Number(c.count) })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStats };
