import { useState, useEffect } from 'react';
import { fetchTasks } from '../../api/tasks';
import { linkTask, unlinkTask } from '../../api/goals';

const LinkTaskModal = ({ goal, onClose, onUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks()
      .then(({ data }) => setTasks(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const linkedIds = new Set(goal.tasks.map((t) => t.id));

  const handleToggle = async (task) => {
    try {
      if (linkedIds.has(task.id)) {
        await unlinkTask(task.id);
        onUpdate(goal.id, goal.tasks.filter((t) => t.id !== task.id));
      } else {
        await linkTask(goal.id, task.id);
        onUpdate(goal.id, [...goal.tasks, { id: task.id, title: task.title, status: task.status }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="glass neon-border rounded-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="neon-text text-lg font-bold">Link Tasks to Goal</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">✕</button>
        </div>
        <p className="text-slate-500 text-xs mb-4">Toggle tasks to link or unlink them from "{goal.title}"</p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-8">No tasks available</p>
        ) : (
          <div className="overflow-y-auto flex flex-col gap-2">
            {tasks.map((task) => {
              const linked = linkedIds.has(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => handleToggle(task)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    linked ? 'bg-violet-600/20 border border-violet-500/30' : 'bg-white/5 border border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    linked ? 'bg-violet-500 border-violet-500' : 'border-slate-600'
                  }`}>
                    {linked && <span className="text-white text-[9px]">✓</span>}
                  </div>
                  <span className="text-sm text-slate-300 flex-1">{task.title}</span>
                  <span className={`text-xs ${task.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {task.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={onClose} className="mt-4 w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all neon-glow">
          Done
        </button>
      </div>
    </div>
  );
};

export default LinkTaskModal;
