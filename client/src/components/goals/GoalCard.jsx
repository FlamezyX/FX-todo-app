const statusStyles = {
  active: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  completed: 'text-green-400 bg-green-400/10 border-green-400/20',
  abandoned: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
};

const GoalCard = ({ goal, onEdit, onDelete, onLinkTasks, onStatusChange }) => {
  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && goal.status === 'active';
  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className={`glass rounded-xl p-5 border transition-all duration-200 ${
      goal.status === 'completed' ? 'border-green-500/20 opacity-75' :
      isOverdue ? 'border-red-500/30' : 'border-white/8 hover:border-violet-500/30'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <p className={`font-semibold text-sm ${goal.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
            {goal.title}
          </p>
          {goal.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{goal.description}</p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => onEdit(goal)} className="text-slate-600 hover:text-violet-400 text-xs transition-colors">✏️</button>
          <button onClick={() => onDelete(goal.id)} className="text-slate-600 hover:text-red-400 text-xs transition-colors">🗑️</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyles[goal.status]}`}>
          {goal.status}
        </span>
        {goal.deadline && (
          <span className={`text-xs px-2 py-0.5 rounded-full border ${
            isOverdue ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-slate-400 bg-white/5 border-white/10'
          }`}>
            {isOverdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Progress</span>
          <span>{goal.progress}% ({goal.tasks.filter((t) => t.status === 'completed').length}/{goal.tasks.length} tasks)</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2">
          <div
            className="bg-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {goal.tasks.length > 0 && (
        <div className="mb-4 flex flex-col gap-1">
          {goal.tasks.slice(0, 3).map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.status === 'completed' ? 'bg-green-400' : 'bg-slate-600'}`} />
              <span className={`text-xs ${t.status === 'completed' ? 'line-through text-slate-600' : 'text-slate-400'}`}>
                {t.title}
              </span>
            </div>
          ))}
          {goal.tasks.length > 3 && (
            <p className="text-xs text-slate-600 ml-3.5">+{goal.tasks.length - 3} more</p>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-white/5">
        <button
          onClick={() => onLinkTasks(goal)}
          className="flex-1 text-xs py-2 rounded-lg bg-white/5 hover:bg-violet-600/20 text-slate-400 hover:text-violet-300 transition-all"
        >
          🔗 Link Tasks
        </button>
        {goal.status !== 'completed' && (
          <button
            onClick={() => onStatusChange(goal.id, 'completed')}
            className="flex-1 text-xs py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-all"
          >
            ✅ Complete
          </button>
        )}
        {goal.status === 'completed' && (
          <button
            onClick={() => onStatusChange(goal.id, 'active')}
            className="flex-1 text-xs py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all"
          >
            🔄 Reopen
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
