import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const MODES = [
  { key: 'work', label: 'Focus', duration: 25 * 60, color: '#7c3aed' },
  { key: 'short', label: 'Short Break', duration: 5 * 60, color: '#059669' },
  { key: 'long', label: 'Long Break', duration: 15 * 60, color: '#2563eb' },
];

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const Pomodoro = () => {
  const [modeIdx, setModeIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customMinutes, setCustomMinutes] = useState('');
  const intervalRef = useRef(null);
  const { toast } = useToast();

  const mode = MODES[modeIdx];
  const progress = 1 - timeLeft / (customMinutes ? customMinutes * 60 : mode.duration);
  const circumference = 2 * Math.PI * 110;

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const handleComplete = useCallback(() => {
    stop();
    if (mode.key === 'work') {
      setSessions((s) => s + 1);
      toast('Focus session complete! Take a break 🎉', 'success');
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('FX ToDo — Focus Complete!', { body: 'Great work! Time for a break.' });
      }
    } else {
      toast('Break over! Time to focus 💪', 'info');
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('FX ToDo — Break Over!', { body: 'Back to work!' });
      }
    }
  }, [mode.key, stop, toast]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { handleComplete(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, handleComplete]);

  // Update document title
  useEffect(() => {
    document.title = running ? `${formatTime(timeLeft)} — ${mode.label} | FX ToDo` : 'FX ToDo';
    return () => { document.title = 'FX ToDo'; };
  }, [timeLeft, running, mode.label]);

  const switchMode = (idx) => {
    stop();
    setModeIdx(idx);
    setCustomMinutes('');
    setTimeLeft(MODES[idx].duration);
  };

  const handleCustomTime = (e) => {
    const val = parseInt(e.target.value);
    setCustomMinutes(e.target.value);
    if (val > 0 && val <= 120) {
      stop();
      setTimeLeft(val * 60);
    }
  };

  const reset = () => {
    stop();
    setTimeLeft(customMinutes ? customMinutes * 60 : mode.duration);
  };

  const totalDuration = customMinutes ? customMinutes * 60 : mode.duration;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Pomodoro Timer <span className="neon-text">⏱️</span></h2>
        <p className="text-slate-500 text-sm mt-1">Stay focused, take breaks, be productive</p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Mode selector */}
        <div className="flex gap-2 mb-8 glass neon-border rounded-xl p-1.5">
          {MODES.map((m, i) => (
            <button
              key={m.key}
              onClick={() => switchMode(i)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                modeIdx === i ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={modeIdx === i ? { backgroundColor: m.color } : {}}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Timer circle */}
        <div className="flex justify-center mb-8">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
              {/* Background circle */}
              <circle cx="120" cy="120" r="110" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              {/* Progress circle */}
              <motion.circle
                cx="120" cy="120" r="110"
                fill="none"
                stroke={mode.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                style={{ filter: `drop-shadow(0 0 8px ${mode.color})` }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-slate-100 tabular-nums">{formatTime(timeLeft)}</span>
              <span className="text-sm text-slate-400 mt-1">{mode.label}</span>
              {sessions > 0 && (
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: Math.min(sessions, 8) }).map((_, i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-violet-500" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={reset}
            className="w-12 h-12 rounded-xl glass border border-white/10 text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center text-lg"
          >
            ↺
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex-1 h-12 rounded-xl font-bold text-white transition-all neon-glow text-lg"
            style={{ backgroundColor: mode.color }}
          >
            {running ? '⏸ Pause' : timeLeft === totalDuration ? '▶ Start' : '▶ Resume'}
          </button>
          <button
            onClick={() => { stop(); setTimeLeft(totalDuration); setSessions(0); }}
            className="w-12 h-12 rounded-xl glass border border-white/10 text-slate-400 hover:text-red-400 transition-all flex items-center justify-center text-lg"
          >
            ■
          </button>
        </div>

        {/* Custom time */}
        <div className="glass neon-border rounded-xl p-4 mb-6">
          <label className="text-xs text-slate-400 mb-2 block">Custom Duration (minutes)</label>
          <input
            type="number"
            min="1"
            max="120"
            value={customMinutes}
            onChange={handleCustomTime}
            placeholder="e.g. 45"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Session stats */}
        <div className="glass neon-border rounded-xl p-4">
          <h3 className="text-slate-300 font-semibold mb-3 text-sm">Today's Sessions</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold neon-text">{sessions}</p>
              <p className="text-xs text-slate-500 mt-1">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{sessions * 25}</p>
              <p className="text-xs text-slate-500 mt-1">Minutes focused</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">{sessions * 20}</p>
              <p className="text-xs text-slate-500 mt-1">XP earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
