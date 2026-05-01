const pool = require('../config/db');

const XP_REWARDS = {
  task_completed: 20,
  task_high_priority: 15,
  habit_completed: 10,
  streak_bonus_7: 50,
  streak_bonus_30: 200,
};

const ACHIEVEMENTS = [
  { key: 'first_task', label: 'First Step', desc: 'Complete your first task', icon: '🎯' },
  { key: 'task_10', label: 'Task Master', desc: 'Complete 10 tasks', icon: '✅' },
  { key: 'task_50', label: 'Productivity Beast', desc: 'Complete 50 tasks', icon: '🔥' },
  { key: 'habit_7_streak', label: 'Week Warrior', desc: 'Reach a 7-day habit streak', icon: '⚡' },
  { key: 'habit_30_streak', label: 'Iron Will', desc: 'Reach a 30-day habit streak', icon: '💎' },
  { key: 'first_goal', label: 'Goal Setter', desc: 'Complete your first goal', icon: '🏆' },
  { key: 'level_5', label: 'Rising Star', desc: 'Reach level 5', icon: '⭐' },
  { key: 'level_10', label: 'Elite', desc: 'Reach level 10', icon: '👑' },
];

const getLevel = (xp) => Math.floor(Math.sqrt(xp / 100)) + 1;
const xpForLevel = (level) => Math.pow(level - 1, 2) * 100;
const xpForNextLevel = (level) => Math.pow(level, 2) * 100;

const awardXP = async (userId, amount, reason) => {
  await pool.query('INSERT INTO xp_logs (user_id, amount, reason) VALUES (?, ?, ?)', [userId, amount, reason]);
  const [[user]] = await pool.query('SELECT xp FROM users WHERE id = ?', [userId]);
  const newXP = user.xp + amount;
  const newLevel = getLevel(newXP);
  await pool.query('UPDATE users SET xp = ?, level = ? WHERE id = ?', [newXP, newLevel, userId]);
  return { xp: newXP, level: newLevel };
};

const checkAchievements = async (userId) => {
  const unlocked = [];

  const [[{ completed }]] = await pool.query(
    "SELECT COUNT(*) AS completed FROM tasks WHERE user_id = ? AND status = 'completed'",
    [userId]
  );
  const [[{ goalsDone }]] = await pool.query(
    "SELECT COUNT(*) AS goalsDone FROM goals WHERE user_id = ? AND status = 'completed'",
    [userId]
  );
  const [[user]] = await pool.query('SELECT level FROM users WHERE id = ?', [userId]);
  const [habits] = await pool.query('SELECT current_streak FROM habits WHERE user_id = ?', [userId]);
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.current_streak), 0);

  const conditions = [
    { key: 'first_task', met: completed >= 1 },
    { key: 'task_10', met: completed >= 10 },
    { key: 'task_50', met: completed >= 50 },
    { key: 'first_goal', met: goalsDone >= 1 },
    { key: 'habit_7_streak', met: maxStreak >= 7 },
    { key: 'habit_30_streak', met: maxStreak >= 30 },
    { key: 'level_5', met: user.level >= 5 },
    { key: 'level_10', met: user.level >= 10 },
  ];

  for (const { key, met } of conditions) {
    if (!met) continue;
    try {
      await pool.query('INSERT IGNORE INTO achievements (user_id, key_name) VALUES (?, ?)', [userId, key]);
      unlocked.push(key);
    } catch (_) {}
  }

  return unlocked;
};

module.exports = { awardXP, checkAchievements, getLevel, xpForLevel, xpForNextLevel, XP_REWARDS, ACHIEVEMENTS };
