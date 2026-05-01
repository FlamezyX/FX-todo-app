const TOUR_STEPS = [
  {
    target: null,
    title: '👋 Welcome to FX ToDo!',
    content: 'This is your futuristic productivity system. Let\'s take a quick tour to show you around. You can skip at any time.',
    position: 'center',
  },
  {
    target: '[data-tour="sidebar"]',
    title: '🧭 Navigation',
    content: 'Use the sidebar to navigate between all pages. On mobile, tap the ☰ button to open it.',
    position: 'right',
  },
  {
    target: '[data-tour="dashboard"]',
    title: '⚡ Dashboard',
    content: 'Your command center. See task stats, completion trends, priority distribution and category breakdown at a glance.',
    position: 'right',
  },
  {
    target: '[data-tour="today"]',
    title: '📅 Today',
    content: 'Your daily focus page. See all tasks due today, overdue tasks and daily habits in one place with an overall progress bar.',
    position: 'right',
  },
  {
    target: '[data-tour="tasks"]',
    title: '✅ Tasks',
    content: 'Create and manage your tasks. Set priorities, deadlines, categories and subtasks. Filter by status or priority.',
    position: 'right',
  },
  {
    target: '[data-tour="goals"]',
    title: '🎯 Goals',
    content: 'Set long-term goals and link tasks to them. Track your progress automatically as you complete linked tasks.',
    position: 'right',
  },
  {
    target: '[data-tour="habits"]',
    title: '🔁 Habits',
    content: 'Build daily or weekly habits. Track your streaks with the 30-day heatmap and earn XP for consistency.',
    position: 'right',
  },
  {
    target: '[data-tour="pomodoro"]',
    title: '⏱️ Pomodoro Timer',
    content: 'Stay focused with the Pomodoro technique. 25 min focus sessions, short and long breaks. Set custom durations and get notified when done.',
    position: 'right',
  },
  {
    target: '[data-tour="gamification"]',
    title: '🎮 Gamification',
    content: 'Earn XP by completing tasks and habits. Level up, unlock achievements and track your productivity journey.',
    position: 'right',
  },
  {
    target: '[data-tour="xp-bar"]',
    title: '📊 XP Progress Bar',
    content: 'Your current level and XP progress is always visible here. Keep completing tasks and habits to level up!',
    position: 'right',
  },
  {
    target: '[data-tour="global-search"]',
    title: '🔍 Global Search',
    content: 'Quickly find any task, goal or habit by typing here. Results appear instantly as you type.',
    position: 'bottom',
  },
  {
    target: '[data-tour="notification-bell"]',
    title: '🔔 Notifications',
    content: 'Stay on top of task deadlines, habit reminders and achievements. Click the bell to see all your notifications.',
    position: 'left',
  },
  {
    target: '[data-tour="settings"]',
    title: '⚙️ Settings',
    content: 'Customize your profile, change your accent color, set time format and manage notification preferences.',
    position: 'right',
  },
  {
    target: '[data-tour="tutorial-btn"]',
    title: '🎓 Replay Tutorial',
    content: 'You can always replay this tutorial by clicking this button. That\'s it — you\'re all set! Go be productive! 🚀',
    position: 'top',
  },
];

export default TOUR_STEPS;
