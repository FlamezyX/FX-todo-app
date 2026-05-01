const pool = require('../config/db');

const pushNotification = async (userId, title, message, type = 'system') => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [userId, title, message, type]
    );
  } catch (err) {
    console.error('Push notification error:', err);
  }
};

const checkDeadlineReminders = async () => {
  try {
    const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [tasks] = await pool.query(
      `SELECT t.id, t.user_id, t.title, u.notif_tasks
       FROM tasks t
       JOIN users u ON t.user_id = u.id
       WHERE t.status = 'pending'
         AND t.deadline BETWEEN ? AND ?
         AND u.notif_tasks = TRUE`,
      [now, in24h]
    );

    for (const task of tasks) {
      await pushNotification(task.user_id, '⏰ Task Deadline Soon', `"${task.title}" is due within 24 hours`, 'task');
    }
  } catch (err) {
    console.error('Deadline reminder error:', err);
  }
};

const checkHabitReminders = async () => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [habits] = await pool.query(
      `SELECT h.id, h.user_id, h.title, u.notif_habits
       FROM habits h
       JOIN users u ON h.user_id = u.id
       LEFT JOIN habit_logs hl ON hl.habit_id = h.id AND hl.completed_at = ?
       WHERE hl.id IS NULL AND u.notif_habits = TRUE AND h.frequency = 'daily'`,
      [today]
    );

    for (const habit of habits) {
      await pushNotification(habit.user_id, '🔁 Habit Reminder', `Don't forget to complete "${habit.title}" today!`, 'habit');
    }
  } catch (err) {
    console.error('Habit reminder error:', err);
  }
};

module.exports = { pushNotification, checkDeadlineReminders, checkHabitReminders };
