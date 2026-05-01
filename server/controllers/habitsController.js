const pool = require('../config/db');
const { awardXP, checkAchievements, XP_REWARDS } = require('../utils/gamification');

const calculateStreak = (logs) => {
  if (!logs.length) return { current: 0, longest: 0 };

  const dates = logs.map((l) => l.completed_at.toISOString().slice(0, 10)).sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let current = 0;
  if (dates[0] === today || dates[0] === yesterday) {
    let prev = dates[0];
    for (const date of dates) {
      const diff = (new Date(prev) - new Date(date)) / 86400000;
      if (diff <= 1) { current++; prev = date; }
      else break;
    }
  }

  let longest = 1, temp = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i - 1]) - new Date(dates[i])) / 86400000;
    if (diff === 1) { temp++; longest = Math.max(longest, temp); }
    else temp = 1;
  }

  return { current, longest: Math.max(longest, current) };
};

const getHabits = async (req, res) => {
  try {
    const [habits] = await pool.query(
      'SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const today = new Date().toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

    const habitsWithLogs = await Promise.all(
      habits.map(async (habit) => {
        const [logs] = await pool.query(
          'SELECT completed_at FROM habit_logs WHERE habit_id = ? AND completed_at >= ? ORDER BY completed_at DESC',
          [habit.id, thirtyDaysAgo]
        );
        const completedToday = logs.some((l) => l.completed_at.toISOString().slice(0, 10) === today);
        const logDates = logs.map((l) => l.completed_at.toISOString().slice(0, 10));
        return { ...habit, logs: logDates, completedToday };
      })
    );

    res.json(habitsWithLogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createHabit = async (req, res) => {
  const { title, description, frequency, color, icon } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const [result] = await pool.query(
      'INSERT INTO habits (user_id, title, description, frequency, color, icon) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description || null, frequency || 'daily', color || '#7c3aed', icon || '⚡']
    );
    const [rows] = await pool.query('SELECT * FROM habits WHERE id = ?', [result.insertId]);
    res.status(201).json({ ...rows[0], logs: [], completedToday: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateHabit = async (req, res) => {
  const { id } = req.params;
  const { title, description, frequency, color, icon } = req.body;

  try {
    const [existing] = await pool.query('SELECT id FROM habits WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing.length) return res.status(404).json({ message: 'Habit not found' });

    await pool.query(
      'UPDATE habits SET title=?, description=?, frequency=?, color=?, icon=? WHERE id=?',
      [title, description || null, frequency, color, icon, id]
    );
    const [rows] = await pool.query('SELECT * FROM habits WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteHabit = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query('SELECT id FROM habits WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing.length) return res.status(404).json({ message: 'Habit not found' });

    await pool.query('DELETE FROM habits WHERE id = ?', [id]);
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleLog = async (req, res) => {
  const { id } = req.params;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const [existing] = await pool.query('SELECT id, title FROM habits WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing.length) return res.status(404).json({ message: 'Habit not found' });

    const [log] = await pool.query(
      'SELECT id FROM habit_logs WHERE habit_id = ? AND completed_at = ?',
      [id, today]
    );

    if (log.length) {
      await pool.query('DELETE FROM habit_logs WHERE habit_id = ? AND completed_at = ?', [id, today]);
    } else {
      await pool.query('INSERT INTO habit_logs (habit_id, user_id, completed_at) VALUES (?, ?, ?)', [id, req.user.id, today]);
    }

    const [allLogs] = await pool.query('SELECT completed_at FROM habit_logs WHERE habit_id = ? ORDER BY completed_at DESC', [id]);
    const { current, longest } = calculateStreak(allLogs);

    await pool.query('UPDATE habits SET current_streak=?, longest_streak=? WHERE id=?', [current, longest, id]);

    if (!log.length) {
      await awardXP(req.user.id, XP_REWARDS.habit_completed, `Completed habit: ${existing[0].title}`);
      if (current === 7) await awardXP(req.user.id, XP_REWARDS.streak_bonus_7, '7-day streak bonus');
      if (current === 30) await awardXP(req.user.id, XP_REWARDS.streak_bonus_30, '30-day streak bonus');
      await checkAchievements(req.user.id);
    }

    res.json({ completedToday: !log.length, current_streak: current, longest_streak: longest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getHabits, createHabit, updateHabit, deleteHabit, toggleLog };
