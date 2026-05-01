const pool = require('../config/db');
const { awardXP, checkAchievements, XP_REWARDS } = require('../utils/gamification');
const { pushNotification } = require('../utils/notifications');

const getTasks = async (req, res) => {
  const { status, priority, category, search } = req.query;
  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [req.user.id];

  if (status) { query += ' AND status = ?'; params.push(status); }
  if (priority) { query += ' AND priority = ?'; params.push(priority); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  if (search) { query += ' AND title LIKE ?'; params.push(`%${search}%`); }

  query += ' ORDER BY created_at DESC';

  try {
    const [tasks] = await pool.query(query, params);

    const tasksWithSubtasks = await Promise.all(
      tasks.map(async (task) => {
        const [subtasks] = await pool.query('SELECT * FROM subtasks WHERE task_id = ?', [task.id]);
        return { ...task, subtasks };
      })
    );

    res.json(tasksWithSubtasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  const { title, description, priority, category, deadline, subtasks } = req.body;

  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, title, description, priority, category, deadline) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description || null, priority || 'medium', category || 'General', deadline || null]
    );

    const taskId = result.insertId;

    if (subtasks?.length) {
      const subtaskValues = subtasks.map((s) => [taskId, s.title]);
      await pool.query('INSERT INTO subtasks (task_id, title) VALUES ?', [subtaskValues]);
    }

    const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    const [subs] = await pool.query('SELECT * FROM subtasks WHERE task_id = ?', [taskId]);

    res.status(201).json({ ...tasks[0], subtasks: subs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, category, deadline, subtasks } = req.body;

  try {
    const [existing] = await pool.query('SELECT id, status FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing.length) return res.status(404).json({ message: 'Task not found' });
    const wasCompleted = existing[0].status === 'completed';

    await pool.query(
      'UPDATE tasks SET title=?, description=?, priority=?, status=?, category=?, deadline=? WHERE id=?',
      [title, description || null, priority, status, category, deadline || null, id]
    );

    if (subtasks) {
      await pool.query('DELETE FROM subtasks WHERE task_id = ?', [id]);
      if (subtasks.length) {
        const subtaskValues = subtasks.map((s) => [id, s.title, s.completed ? 1 : 0]);
        await pool.query('INSERT INTO subtasks (task_id, title, completed) VALUES ?', [subtaskValues]);
      }
    }

    const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    const [subs] = await pool.query('SELECT * FROM subtasks WHERE task_id = ?', [id]);

    if (status === 'completed' && !wasCompleted) {
      let xp = XP_REWARDS.task_completed;
      if (tasks[0].priority === 'high') xp += XP_REWARDS.task_high_priority;
      await awardXP(req.user.id, xp, `Completed task: ${tasks[0].title}`);
      await checkAchievements(req.user.id);
      await pushNotification(req.user.id, '✅ Task Completed', `You completed "${tasks[0].title}" and earned ${xp} XP!`, 'task');
    }

    res.json({ ...tasks[0], subtasks: subs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing.length) return res.status(404).json({ message: 'Task not found' });

    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleSubtask = async (req, res) => {
  const { subtaskId } = req.params;
  try {
    await pool.query('UPDATE subtasks SET completed = NOT completed WHERE id = ?', [subtaskId]);
    const [rows] = await pool.query('SELECT * FROM subtasks WHERE id = ?', [subtaskId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, toggleSubtask };
