import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-white/10 rounded-lg px-4 py-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const TrendChart = ({ data }) => (
  <div className="glass neon-border rounded-xl p-6">
    <h3 className="text-slate-300 font-semibold mb-6">7-Day Task Trend</h3>
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
        <Area type="monotone" dataKey="completed" stroke="#7c3aed" strokeWidth={2} fill="url(#colorCompleted)" />
        <Area type="monotone" dataKey="pending" stroke="#eab308" strokeWidth={2} fill="url(#colorPending)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default TrendChart;
