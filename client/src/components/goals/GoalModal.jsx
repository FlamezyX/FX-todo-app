import { useState, useEffect } from 'react';

const GoalModal = ({ onClose, onSave, goal }) => {
  const [form, setForm] = useState({ title: '', description: '', deadline: '' });

  useEffect(() => {
    if (goal) {
      setForm({
        title: goal.title,
        description: goal.description || '',
        deadline: goal.deadline ? goal.deadline.slice(0, 10) : '',
      });
    }
  }, [goal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, deadline: form.deadline || null });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="glass neon-border rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="neon-text text-xl font-bold">{goal ? 'Edit Goal' : 'New Goal'}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Goal title..."
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What do you want to achieve?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-slate-200 text-sm transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all neon-glow">
              {goal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
