import { useState, useEffect, useCallback } from 'react';
import { fetchTimeline } from '../api/search';

const FILTERS = ['all', 'tasks', 'habits', 'goals'];

const typeConfig = {
  task: { icon: '✅', color: 'bg-violet-500/20 border-violet-500/30', label: 'Task Completed' },
  habit: { icon: '🔁', color: 'bg-green-500/20 border-green-500/30', label: 'Habit Done' },
  goal: { icon: '🎯', color: 'bg-yellow-500/20 border-yellow-500/30', label: 'Goal Achieved' },
};

const groupByDate = (events) => {
  const groups = {};
  events.forEach((e) => {
    const date = new Date(e.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!groups[date]) groups[date] = [];
    groups[date].push(e);
  });
  return groups;
};

const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (f, p) => {
    setLoading(true);
    try {
      const { data } = await fetchTimeline(f, p);
      if (p === 1) {
        setEvents(data.events);
      } else {
        setEvents((prev) => [...prev, ...data.events]);
      }
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setEvents([]);
    load(filter, 1);
  }, [filter, load]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    load(filter, next);
  };

  const grouped = groupByDate(events);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Timeline <span className="neon-text">🕒</span></h2>
        <p className="text-slate-500 text-sm mt-1">Your activity history</p>
      </div>

      <div className="flex gap-1 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filter === f ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && events.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🕒</p>
          <p className="text-slate-400">No activity yet</p>
          <p className="text-slate-600 text-sm mt-1">Complete tasks and habits to see your timeline</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />

          <div className="flex flex-col gap-8 pl-12">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <div className="relative mb-4">
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-violet-500 neon-glow" />
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{date}</p>
                </div>

                <div className="flex flex-col gap-3">
                  {items.map((event, i) => {
                    const config = typeConfig[event.type];
                    return (
                      <div key={i} className={`glass border rounded-xl p-4 ${config.color}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{event.icon || config.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-slate-500">{config.label}</span>
                              {event.priority && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  event.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                  event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>{event.priority}</span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-slate-200">{event.title}</p>
                            {event.category && (
                              <p className="text-xs text-slate-500 mt-1">{event.category}</p>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 flex-shrink-0">
                            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {page < totalPages && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2.5 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-300 text-sm rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timeline;
