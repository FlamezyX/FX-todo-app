import { useState, useEffect } from 'react';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../api/goals';
import GoalCard from '../components/goals/GoalCard';
import GoalModal from '../components/goals/GoalModal';
import LinkTaskModal from '../components/goals/LinkTaskModal';
import ConfirmModal from '../components/layout/ConfirmModal';
import { useToast } from '../context/ToastContext';

const FILTERS = ['all', 'active', 'completed', 'abandoned'];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [linkingGoal, setLinkingGoal] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGoals()
      .then(({ data }) => setGoals(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (form) => {
    try {
      if (editingGoal) {
        const { data } = await updateGoal(editingGoal.id, { ...form, status: editingGoal.status });
        setGoals((prev) => prev.map((g) => (g.id === editingGoal.id ? data : g)));
        toast('Goal updated!', 'success');
      } else {
        const { data } = await createGoal(form);
        setGoals((prev) => [data, ...prev]);
        toast('Goal created!', 'success');
      }
      setShowModal(false);
      setEditingGoal(null);
    } catch (err) {
      toast('Failed to save goal', 'error');
    }
  };

  const handleDelete = (id) => setConfirmId(id);

  const confirmDelete = async () => {
    try {
      await deleteGoal(confirmId);
      setGoals((prev) => prev.filter((g) => g.id !== confirmId));
      toast('Goal deleted', 'info');
    } catch (err) {
      toast('Failed to delete goal', 'error');
    } finally {
      setConfirmId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const goal = goals.find((g) => g.id === id);
      const { data } = await updateGoal(id, { ...goal, status });
      setGoals((prev) => prev.map((g) => (g.id === id ? data : g)));
      if (status === 'completed') toast('Goal achieved! 🏆', 'success');
    } catch (err) {
      toast('Failed to update goal', 'error');
    }
  };

  const handleLinkUpdate = (goalId, updatedTasks) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const total = updatedTasks.length;
        const completed = updatedTasks.filter((t) => t.status === 'completed').length;
        const progress = total ? Math.round((completed / total) * 100) : 0;
        return { ...g, tasks: updatedTasks, progress };
      })
    );
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const filtered = filter === 'all' ? goals : goals.filter((g) => g.status === filter);

  const counts = {
    all: goals.length,
    active: goals.filter((g) => g.status === 'active').length,
    completed: goals.filter((g) => g.status === 'completed').length,
    abandoned: goals.filter((g) => g.status === 'abandoned').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Goals <span className="neon-text">🎯</span></h2>
          <p className="text-slate-500 text-sm mt-1">{goals.length} total goals</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all neon-glow flex items-center gap-2"
        >
          + New Goal
        </button>
      </div>

      <div className="flex gap-1 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filter === f ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1 opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🎯</p>
          <p className="text-slate-400">No goals found</p>
          <p className="text-slate-600 text-sm mt-1">Set your first goal to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLinkTasks={setLinkingGoal}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {showModal && (
        <GoalModal
          goal={editingGoal}
          onClose={() => { setShowModal(false); setEditingGoal(null); }}
          onSave={handleSave}
        />
      )}

      {linkingGoal && (
        <LinkTaskModal
          goal={linkingGoal}
          onClose={() => setLinkingGoal(null)}
          onUpdate={handleLinkUpdate}
        />
      )}
      {confirmId && (
        <ConfirmModal
          message="Are you sure you want to delete this goal?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
};

export default Goals;
