const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getGoals, createGoal, updateGoal, deleteGoal, linkTask, unlinkTask } = require('../controllers/goalsController');

router.use(protect);

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.post('/:id/link', linkTask);
router.patch('/unlink/:taskId', unlinkTask);

module.exports = router;
