import { useState, useEffect } from 'react';

const ICONS = ['⚡', '💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '🎯', '🧠', '✍️', '🎵'];
const COLORS = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626', '#db2777', '#0891b2', '#65a30d'];

const HabitModal = ({ onClose, onSave, habit }) => {
  const [form, setForm] = useState({
    title: '', description: '', frequency: 'daily', color: '#7c3aed', icon: '⚡',
  });

  useEffect(() => {
    if (habit) setForm({
      title: habit.title,
      description: habit.description || '',
      frequency: habit.frequency,
      color: habit.color,
      icon: habit.icon,
    });
  }, [habit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="glass neon-border rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="neon-text text-xl font-bold">{habit ? 'Edit Habit' : 'New Habit'}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Habit title..."
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Frequency</label>
            <select
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, icon })}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                    form.icon === icon ? 'bg-violet-600 neon-glow' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-7 h-7 rounded-full transition-all ${form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f]' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-slate-200 text-sm transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all neon-glow">
              {habit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
