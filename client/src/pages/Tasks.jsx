import { useState, useEffect, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import ConfirmModal from '../components/layout/ConfirmModal';
import { useToast } from '../context/ToastContext';

const FILTERS = ['all', 'pending', 'completed', 'missed'];
const PRIORITIES = ['all', 'low', 'medium', 'high'];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (search) params.search = search;
      const { data } = await fetchTasks(params);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, search]);

  useEffect(() => {
    const delay = setTimeout(loadTasks, 300);
    return () => clearTimeout(delay);
  }, [loadTasks]);

  const handleSave = async (form) => {
    try {
      if (editingTask) {
        const { data } = await updateTask(editingTask.id, { ...form, status: editingTask.status });
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? data : t)));
        toast('Task updated successfully', 'success');
      } else {
        const { data } = await createTask(form);
        setTasks((prev) => [data, ...prev]);
        toast('Task created!', 'success');
      }
      setShowModal(false);
      setEditingTask(null);
    } catch (err) {
      toast('Failed to save task', 'error');
    }
  };

  const handleDelete = async (id) => setConfirmId(id);

  const confirmDelete = async () => {
    try {
      await deleteTask(confirmId);
      setTasks((prev) => prev.filter((t) => t.id !== confirmId));
      toast('Task deleted', 'info');
    } catch (err) {
      toast('Failed to delete task', 'error');
    } finally {
      setConfirmId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const task = tasks.find((t) => t.id === id);
      const { data } = await updateTask(id, { ...task, status });
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
      if (status === 'completed') toast('Task completed! XP earned 🎉', 'success');
    } catch (err) {
      toast('Failed to update task', 'error');
    }
  };

  const handleSubtaskToggle = (taskId, subtaskId, completed) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, completed } : s)) }
          : t
      )
    );
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    missed: tasks.filter((t) => t.status === 'missed').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Tasks <span className="neon-text">✅</span></h2>
          <p className="text-slate-500 text-sm mt-1">{tasks.length} total tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all neon-glow flex items-center gap-2"
        >
          + New Task
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors w-56"
        />
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                statusFilter === f ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && <span className="ml-1 opacity-60">({counts[f]})</span>}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                priorityFilter === p ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-slate-400">No tasks found</p>
          <p className="text-slate-600 text-sm mt-1">Create your first task to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onSubtaskToggle={handleSubtaskToggle}
            />
          ))}
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
      {confirmId && (
        <ConfirmModal
          message="Are you sure you want to delete this task?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
};

export default Tasks;
