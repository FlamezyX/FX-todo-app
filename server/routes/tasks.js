const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getTasks, createTask, updateTask, deleteTask, toggleSubtask } = require('../controllers/tasksController');

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/subtask/:subtaskId/toggle', toggleSubtask);

module.exports = router;
