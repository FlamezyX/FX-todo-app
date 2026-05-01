import { useState, useEffect } from 'react';

const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['General', 'Work', 'School', 'Personal', 'Health', 'Finance'];

const priorityColor = { low: 'text-green-400', medium: 'text-yellow-400', high: 'text-red-400' };

const TaskModal = ({ onClose, onSave, task }) => {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium',
    category: 'General', deadline: '', subtasks: [],
  });
  const [subtaskInput, setSubtaskInput] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        category: task.category,
        deadline: task.deadline ? task.deadline.slice(0, 16) : '',
        subtasks: task.subtasks || [],
      });
    }
  }, [task]);

  const addSubtask = () => {
    if (!subtaskInput.trim()) return;
    setForm((f) => ({ ...f, subtasks: [...f.subtasks, { title: subtaskInput.trim(), completed: false }] }));
    setSubtaskInput('');
  };

  const removeSubtask = (i) =>
    setForm((f) => ({ ...f, subtasks: f.subtasks.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, deadline: form.deadline || null });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="glass neon-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="neon-text text-xl font-bold">{task ? 'Edit Task' : 'New Task'}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title..."
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional notes..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} className={priorityColor[p]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Deadline</label>
            <input
              type="datetime-local"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Subtasks</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                placeholder="Add subtask..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500"
              />
              <button type="button" onClick={addSubtask} className="px-4 py-2 bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 rounded-lg text-sm transition-colors">
                Add
              </button>
            </div>
            {form.subtasks.map((s, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 px-3 bg-white/5 rounded-lg mb-1">
                <span className="text-slate-400 text-xs flex-1">{s.title}</span>
                <button type="button" onClick={() => removeSubtask(i)} className="text-slate-600 hover:text-red-400 text-xs">✕</button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-slate-200 text-sm transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all neon-glow">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
