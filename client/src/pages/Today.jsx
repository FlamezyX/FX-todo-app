import { useState, useEffect } from 'react';
import { fetchTasks, updateTask } from '../api/tasks';
import { fetchHabits, toggleHabitLog } from '../api/habits';
import { useToast } from '../context/ToastContext';

const Today = () => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const today = new Date().toISOString().slice(0, 10);
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    Promise.all([fetchTasks({ status: 'pending' }), fetchHabits()])
      .then(([tasksRes, habitsRes]) => {
        // Tasks due today or overdue
        const todayTasks = tasksRes.data.filter((t) => {
          if (!t.deadline) return false;
          return t.deadline.slice(0, 10) <= today;
        });
        setTasks(todayTasks);
        setHabits(habitsRes.data.filter((h) => h.frequency === 'daily'));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCompleteTask = async (task) => {
    try {
      const { data } = await updateTask(task.id, { ...task, status: 'completed' });
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      toast('Task completed! 🎉', 'success');
    } catch {
      toast('Failed to update task', 'error');
    }
  };

  const handleToggleHabit = async (id) => {
    try {
      const { data } = await toggleHabitLog(id);
      setHabits((prev) => prev.map((h) => h.id === id ? { ...h, completedToday: data.completedToday, current_streak: data.current_streak } : h));
      if (data.completedToday) toast('Habit done! 🔥', 'success');
    } catch {
      toast('Failed to update habit', 'error');
    }
  };

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const completedHabits = habits.filter((h) => h.completedToday).length;
  const totalItems = tasks.length + habits.length;
  const completedItems = completedTasks + completedHabits;
  const overallProgress = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100">{greeting()} <span className="neon-text">📅</span></h2>
        <p className="text-slate-500 text-sm mt-1">{dateStr}</p>
      </div>

      {/* Overall progress */}
      <div className="glass neon-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-300 font-semibold">Today's Progress</p>
          <p className="text-violet-400 font-bold">{overallProgress}%</p>
        </div>
        <div className="w-full bg-white/5 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-violet-600 to-violet-400 h-3 rounded-full transition-all duration-700 neon-glow"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">{completedItems} of {totalItems} items completed</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks due today */}
          <div>
            <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
              ✅ Tasks Due Today
              <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </h3>
            {tasks.length === 0 ? (
              <div className="glass neon-border rounded-xl p-6 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-slate-400 text-sm">No tasks due today!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {tasks.map((task) => {
                  const isOverdue = task.deadline.slice(0, 10) < today;
                  return (
                    <div key={task.id} className={`glass rounded-xl p-4 border transition-all ${isOverdue ? 'border-red-500/30' : 'border-white/8'}`}>
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleCompleteTask(task)}
                          className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-600 hover:border-violet-400 flex-shrink-0 transition-all"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-slate-200">{task.title}</p>
                          <div className="flex gap-2 mt-1.5 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                              'bg-green-500/10 text-green-400'
                            }`}>{task.priority}</span>
                            {isOverdue && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">overdue</span>}
                            <span className="text-xs text-slate-500">{task.category}</span>
                          </div>
                        </div>
                        {task.deadline && (
                          <p className={`text-xs flex-shrink-0 ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
                            {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Daily habits */}
          <div>
            <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
              🔁 Daily Habits
              <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">{completedHabits}/{habits.length}</span>
            </h3>
            {habits.length === 0 ? (
              <div className="glass neon-border rounded-xl p-6 text-center">
                <p className="text-2xl mb-2">🔁</p>
                <p className="text-slate-400 text-sm">No daily habits yet. Add some!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {habits.map((habit) => (
                  <div key={habit.id} className={`glass rounded-xl p-4 border transition-all ${habit.completedToday ? 'border-green-500/20 opacity-75' : 'border-white/8'}`}
                    style={{ borderLeftColor: habit.color, borderLeftWidth: '3px' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{habit.icon}</span>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${habit.completedToday ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {habit.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: habit.color }}>
                          🔥 {habit.current_streak} day streak
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleHabit(habit.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          habit.completedToday ? 'text-white' : 'bg-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                        style={habit.completedToday ? { backgroundColor: habit.color } : {}}
                      >
                        {habit.completedToday ? '✓ Done' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Today;
