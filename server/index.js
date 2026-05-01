const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://fx-todo-app.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api', require('./routes/search'));
app.use('/api/settings', require('./routes/settings'));

app.get('/', (req, res) => res.json({ message: 'FX To-Do API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  const { checkDeadlineReminders, checkHabitReminders } = require('./utils/notifications');
  // Run reminders every hour
  setInterval(checkDeadlineReminders, 60 * 60 * 1000);
  // Run habit reminders once at 8am equivalent (every 6 hours)
  setInterval(checkHabitReminders, 6 * 60 * 60 * 1000);
  // Run once on startup
  checkDeadlineReminders();
  checkHabitReminders();
});
