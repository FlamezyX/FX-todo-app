import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = { low: '#22c55e', medium: '#eab308', high: '#ef4444' };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-white/10 rounded-lg px-4 py-2 text-xs">
      <p style={{ color: COLORS[payload[0].name] }}>{payload[0].name}: {payload[0].value}</p>
    </div>
  );
};

const PriorityChart = ({ data }) => (
  <div className="glass neon-border rounded-xl p-6">
    <h3 className="text-slate-300 font-semibold mb-6">Priority Distribution</h3>
    {data.length === 0 ? (
      <p className="text-slate-600 text-sm text-center py-16">No data yet</p>
    ) : (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#7c3aed'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default PriorityChart;
