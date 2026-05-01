const pool = require('../config/db');

const getGoals = async (req, res) => {
  try {
    const [goals] = await pool.query(
      'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const goalsWithTasks = await Promise.all(
      goals.map(async (goal) => {
        const [tasks] = await pool.query(
          'SELECT id, title, status FROM tasks WHERE goal_id = ?',
          [goal.id]
        );
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'completed').length;
        const progress = total ? Math.round((completed / total) * 100) : 0;
        return { ...goal, tasks, progress };
      })
    );

    res.json(goalsWithTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createGoal = async (req, res) => {
  const { title, description, deadline } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const [result] = await pool.query(
      'INSERT INTO goals (user_id, title, description, deadline) VALUES (?, ?, ?, ?)',
      [req.user.id, title, description || null, deadline || null]
    );
    const [rows] = await pool.query('SELECT * FROM goals WHERE id = ?', [result.insertId]);
    res.status(201).json({ ...rows[0], tasks: [], progress: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, status } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM goals WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (!existing.length) return res.status(404).json({ message: 'Goal not found' });

    await pool.query(
      'UPDATE goals SET title=?, description=?, deadline=?, status=? WHERE id=?',
      [title, description || null, deadline || null, status, id]
    );

    const [rows] = await pool.query('SELECT * FROM goals WHERE id = ?', [id]);
    const [tasks] = await pool.query('SELECT id, title, status FROM tasks WHERE goal_id = ?', [id]);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const progress = total ? Math.round((completed / total) * 100) : 0;

    res.json({ ...rows[0], tasks, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteGoal = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query(
      'SELECT id FROM goals WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (!existing.length) return res.status(404).json({ message: 'Goal not found' });

    await pool.query('DELETE FROM goals WHERE id = ?', [id]);
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const linkTask = async (req, res) => {
  const { id } = req.params;
  const { taskId } = req.body;

  try {
    const [goal] = await pool.query(
      'SELECT id FROM goals WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (!goal.length) return res.status(404).json({ message: 'Goal not found' });

    await pool.query('UPDATE tasks SET goal_id = ? WHERE id = ? AND user_id = ?', [id, taskId, req.user.id]);
    res.json({ message: 'Task linked to goal' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const unlinkTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    await pool.query('UPDATE tasks SET goal_id = NULL WHERE id = ? AND user_id = ?', [taskId, req.user.id]);
    res.json({ message: 'Task unlinked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal, linkTask, unlinkTask };
