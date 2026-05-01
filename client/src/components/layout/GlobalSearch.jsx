import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { globalSearch } from '../../api/search';

const typeStyle = {
  task: { icon: '✅', color: 'text-violet-400', label: 'Task' },
  goal: { icon: '🎯', color: 'text-yellow-400', label: 'Goal' },
  habit: { icon: '🔁', color: 'text-green-400', label: 'Habit' },
};

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) { setResults(null); setOpen(false); return; }
    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await globalSearch(query);
        setResults(data);
        setOpen(true);
      } catch (_) {}
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (type) => {
    setQuery('');
    setOpen(false);
    navigate(`/${type}s`);
  };

  const allResults = results
    ? [
        ...results.tasks.map((r) => ({ ...r, type: 'task' })),
        ...results.goals.map((r) => ({ ...r, type: 'goal' })),
        ...results.habits.map((r) => ({ ...r, type: 'habit' })),
      ]
    : [];

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks, goals, habits..."
          className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors w-64"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border border-violet-500 border-t-transparent rounded-full animate-spin" />
          </span>
        )}
      </div>

      {open && (
        <div className="absolute top-11 left-0 w-80 glass neon-border rounded-xl shadow-2xl z-50 overflow-hidden">
          {allResults.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-6">No results found</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {allResults.map((r, i) => {
                const style = typeStyle[r.type];
                return (
                  <div
                    key={i}
                    onClick={() => handleSelect(r.type)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                  >
                    <span className="text-lg">{r.icon || style.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">{r.title}</p>
                      <p className={`text-xs ${style.color}`}>{style.label}</p>
                    </div>
                    {r.status && (
                      <span className={`text-xs ${r.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {r.status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
