const HabitCalendar = ({ logs, color }) => {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="flex flex-wrap gap-1 mt-3">
      {days.map((day) => {
        const done = logs.includes(day);
        return (
          <div
            key={day}
            title={day}
            className="w-4 h-4 rounded-sm transition-all"
            style={{ backgroundColor: done ? color : 'rgba(255,255,255,0.05)' }}
          />
        );
      })}
    </div>
  );
};

export default HabitCalendar;
