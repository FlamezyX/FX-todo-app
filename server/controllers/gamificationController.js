const pool = require('../config/db');
const { getLevel, xpForLevel, xpForNextLevel, ACHIEVEMENTS } = require('../utils/gamification');

const getProfile = async (req, res) => {
  try {
    const [[user]] = await pool.query('SELECT id, username, xp, level FROM users WHERE id = ?', [req.user.id]);
    const [xpLogs] = await pool.query(
      'SELECT amount, reason, created_at FROM xp_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [req.user.id]
    );
    const [unlockedRows] = await pool.query('SELECT key_name, unlocked_at FROM achievements WHERE user_id = ?', [req.user.id]);
    const unlockedMap = Object.fromEntries(unlockedRows.map((r) => [r.key_name, r.unlocked_at]));

    const level = getLevel(user.xp);
    const currentLevelXP = xpForLevel(level);
    const nextLevelXP = xpForNextLevel(level);
    const progress = Math.round(((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);

    const achievements = ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: !!unlockedMap[a.key],
      unlocked_at: unlockedMap[a.key] || null,
    }));

    res.json({
      xp: user.xp,
      level,
      progress,
      currentLevelXP,
      nextLevelXP,
      xpLogs,
      achievements,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile };
