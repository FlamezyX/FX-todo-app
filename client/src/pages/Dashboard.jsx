import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchStats } from '../api/stats';
import TrendChart from '../components/dashboard/TrendChart';
import PriorityChart from '../components/dashboard/PriorityChart';
import CategoryChart from '../components/dashboard/CategoryChart';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="glass neon-border rounded-xl p-6 flex items-center gap-4">
    <div className={`text-2xl p-3 rounded-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completionRate = stats?.counts.total
    ? Math.round((stats.counts.completed / stats.counts.total) * 100)
    : 0;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100">
          Welcome back, <span className="neon-text">{user?.username}</span> ⚡
        </h2>
        <p className="text-slate-500 text-sm mt-1">Here's your productivity overview</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon="📋" label="Total Tasks" value={stats?.counts.total ?? 0} color="bg-violet-500/10" />
            <StatCard icon="✅" label="Completed" value={stats?.counts.completed ?? 0} color="bg-green-500/10" sub={`${completionRate}% rate`} />
            <StatCard icon="⏳" label="Pending" value={stats?.counts.pending ?? 0} color="bg-yellow-500/10" />
            <StatCard icon="❌" label="Missed" value={stats?.counts.missed ?? 0} color="bg-red-500/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <TrendChart data={stats?.trend ?? []} />
            <PriorityChart data={stats?.priority ?? []} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CategoryChart data={stats?.category ?? []} />

            <div className="glass neon-border rounded-xl p-6">
              <h3 className="text-slate-300 font-semibold mb-4">Overall Progress</h3>
              {stats?.counts.total === 0 ? (
                <p className="text-slate-600 text-sm">No tasks yet. Start by adding one!</p>
              ) : (
                <div className="flex flex-col gap-5">
                  {[
                    { label: 'Completed', value: stats.counts.completed, total: stats.counts.total, color: 'bg-green-500' },
                    { label: 'Pending', value: stats.counts.pending, total: stats.counts.total, color: 'bg-yellow-500' },
                    { label: 'Missed', value: stats.counts.missed, total: stats.counts.total, color: 'bg-red-500' },
                  ].map(({ label, value, total, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>{label}</span>
                        <span>{value} / {total} ({Math.round((value / total) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div
                          className={`${color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(value / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
