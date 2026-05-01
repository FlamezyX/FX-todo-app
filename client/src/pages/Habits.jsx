import { useState, useEffect } from 'react';
import { fetchHabits, createHabit, updateHabit, deleteHabit, toggleHabitLog } from '../api/habits';
import HabitCard from '../components/habits/HabitCard';
import HabitModal from '../components/habits/HabitModal';
import ConfirmModal from '../components/layout/ConfirmModal';
import { useToast } from '../context/ToastContext';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHabits()
      .then(({ data }) => setHabits(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (form) => {
    try {
      if (editingHabit) {
        const { data } = await updateHabit(editingHabit.id, form);
        setHabits((prev) => prev.map((h) => (h.id === editingHabit.id ? { ...h, ...data } : h)));
        toast('Habit updated!', 'success');
      } else {
        const { data } = await createHabit(form);
        setHabits((prev) => [data, ...prev]);
        toast('Habit created!', 'success');
      }
      setShowModal(false);
      setEditingHabit(null);
    } catch (err) {
      toast('Failed to save habit', 'error');
    }
  };

  const handleDelete = (id) => setConfirmId(id);

  const confirmDelete = async () => {
    try {
      await deleteHabit(confirmId);
      setHabits((prev) => prev.filter((h) => h.id !== confirmId));
      toast('Habit deleted', 'info');
    } catch (err) {
      toast('Failed to delete habit', 'error');
    } finally {
      setConfirmId(null);
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleHabitLog(id);
      setHabits((prev) =>
        prev.map((h) =>
          h.id === id
            ? { ...h, completedToday: data.completedToday, current_streak: data.current_streak, longest_streak: data.longest_streak }
            : h
        )
      );
      if (data.completedToday) toast('Habit completed! Keep it up 🔥', 'success');
    } catch (err) {
      toast('Failed to update habit', 'error');
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowModal(true);
  };

  const completedToday = habits.filter((h) => h.completedToday).length;
  const filtered = filter === 'all' ? habits : filter === 'done' ? habits.filter((h) => h.completedToday) : habits.filter((h) => !h.completedToday);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Habits <span className="neon-text">🔁</span></h2>
          <p className="text-slate-500 text-sm mt-1">
            {completedToday}/{habits.length} completed today
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all neon-glow"
        >
          + New Habit
        </button>
      </div>

      {habits.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass neon-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold neon-text">{habits.length}</p>
            <p className="text-xs text-slate-500 mt-1">Total Habits</p>
          </div>
          <div className="glass neon-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{completedToday}</p>
            <p className="text-xs text-slate-500 mt-1">Done Today</p>
          </div>
          <div className="glass neon-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {habits.reduce((max, h) => Math.max(max, h.current_streak), 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Best Active Streak</p>
          </div>
        </div>
      )}

      <div className="flex gap-1 mb-6">
        {[['all', 'All'], ['pending', 'Pending'], ['done', 'Done Today']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filter === val ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔁</p>
          <p className="text-slate-400">No habits found</p>
          <p className="text-slate-600 text-sm mt-1">Build your first habit to start tracking</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <HabitModal
          habit={editingHabit}
          onClose={() => { setShowModal(false); setEditingHabit(null); }}
          onSave={handleSave}
        />
      )}
      {confirmId && (
        <ConfirmModal
          message="Are you sure you want to delete this habit?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
};

export default Habits;
