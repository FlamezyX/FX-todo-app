const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getHabits, createHabit, updateHabit, deleteHabit, toggleLog } = require('../controllers/habitsController');

router.use(protect);

router.get('/', getHabits);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.patch('/:id/toggle', toggleLog);

module.exports = router;
