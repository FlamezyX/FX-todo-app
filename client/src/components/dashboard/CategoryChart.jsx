import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#8b5cf6', '#a78bfa'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-white/10 rounded-lg px-4 py-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-violet-400">Tasks: {payload[0].value}</p>
    </div>
  );
};

const CategoryChart = ({ data }) => (
  <div className="glass neon-border rounded-xl p-6">
    <h3 className="text-slate-300 font-semibold mb-6">Tasks by Category</h3>
    {data.length === 0 ? (
      <p className="text-slate-600 text-sm text-center py-16">No data yet</p>
    ) : (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.05)' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default CategoryChart;
