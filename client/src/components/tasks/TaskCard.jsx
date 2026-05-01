import { toggleSubtask } from '../../api/tasks';

const priorityStyles = {
  low: 'text-green-400 bg-green-400/10 border-green-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  high: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const statusStyles = {
  pending: 'text-yellow-400',
  completed: 'text-green-400',
  missed: 'text-red-400',
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, onSubtaskToggle }) => {
  const completedSubs = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubs = task.subtasks?.length || 0;
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status === 'pending';

  const handleSubtaskToggle = async (subtaskId) => {
    try {
      const { data } = await toggleSubtask(subtaskId);
      onSubtaskToggle(task.id, subtaskId, data.completed);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`glass rounded-xl p-5 border transition-all duration-200 ${
      task.status === 'completed' ? 'border-green-500/20 opacity-70' : isOverdue ? 'border-red-500/30' : 'border-white/8 hover:border-violet-500/30'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed')}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
              task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-slate-600 hover:border-violet-400'
            }`}
          >
            {task.status === 'completed' && <span className="text-white text-xs">✓</span>}
          </button>
          <div className="flex-1">
            <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => onEdit(task)} className="text-slate-600 hover:text-violet-400 text-xs transition-colors">✏️</button>
          <button onClick={() => onDelete(task.id)} className="text-slate-600 hover:text-red-400 text-xs transition-colors">🗑️</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
          {task.category}
        </span>
        {isOverdue && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            overdue
          </span>
        )}
      </div>

      {task.deadline && (
        <p className={`text-xs mb-3 ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
          ⏰ {new Date(task.deadline).toLocaleString()}
        </p>
      )}

      {totalSubs > 0 && (
        <div className="mt-3 border-t border-white/5 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Subtasks</span>
            <span className="text-xs text-slate-500">{completedSubs}/{totalSubs}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1 mb-2">
            <div
              className="bg-violet-500 h-1 rounded-full transition-all"
              style={{ width: `${totalSubs ? (completedSubs / totalSubs) * 100 : 0}%` }}
            />
          </div>
          <div className="flex flex-col gap-1">
            {task.subtasks.map((s) => (
              <div key={s.id} className="flex items-center gap-2 cursor-pointer" onClick={() => handleSubtaskToggle(s.id)}>
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                  s.completed ? 'bg-violet-500 border-violet-500' : 'border-slate-600'
                }`}>
                  {s.completed && <span className="text-white text-[8px]">✓</span>}
                </div>
                <span className={`text-xs ${s.completed ? 'line-through text-slate-600' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
