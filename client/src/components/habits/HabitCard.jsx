import HabitCalendar from './HabitCalendar';

const HabitCard = ({ habit, onToggle, onEdit, onDelete }) => {
  return (
    <div
      className="glass rounded-xl p-5 border border-white/8 hover:border-white/15 transition-all duration-200"
      style={{ borderLeftColor: habit.color, borderLeftWidth: '3px' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{habit.icon}</span>
          <div>
            <p className="text-sm font-semibold text-slate-200">{habit.title}</p>
            {habit.description && (
              <p className="text-xs text-slate-500 mt-0.5">{habit.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(habit)} className="text-slate-600 hover:text-violet-400 text-xs transition-colors">✏️</button>
          <button onClick={() => onDelete(habit.id)} className="text-slate-600 hover:text-red-400 text-xs transition-colors">🗑️</button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="text-center">
          <p className="text-xl font-bold" style={{ color: habit.color }}>{habit.current_streak}</p>
          <p className="text-xs text-slate-500">streak</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-slate-300">{habit.longest_streak}</p>
          <p className="text-xs text-slate-500">best</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-slate-400 capitalize">{habit.frequency}</p>
          <p className="text-xs text-slate-500">frequency</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => onToggle(habit.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              habit.completedToday
                ? 'text-white'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
            style={habit.completedToday ? { backgroundColor: habit.color } : {}}
          >
            {habit.completedToday ? '✓ Done' : 'Mark Done'}
          </button>
        </div>
      </div>

      <HabitCalendar logs={habit.logs} color={habit.color} />
    </div>
  );
};

export default HabitCard;
