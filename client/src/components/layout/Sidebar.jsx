import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { fetchGamificationProfile } from '../../api/gamification';
import usePWAInstall from '../../hooks/usePWAInstall';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: '⚡', label: 'Dashboard', tour: 'dashboard' },
  { to: '/today', icon: '📅', label: 'Today', tour: 'today' },
  { to: '/tasks', icon: '✅', label: 'Tasks', tour: 'tasks' },
  { to: '/goals', icon: '🎯', label: 'Goals', tour: 'goals' },
  { to: '/habits', icon: '🔁', label: 'Habits', tour: 'habits' },
  { to: '/pomodoro', icon: '⏱️', label: 'Pomodoro', tour: 'pomodoro' },
  { to: '/gamification', icon: '🎮', label: 'Gamification', tour: 'gamification' },
  { to: '/timeline', icon: '🕒', label: 'Timeline' },
  { to: '/settings', icon: '⚙️', label: 'Settings', tour: 'settings' },
];

const SidebarContent = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [gProfile, setGProfile] = useState(null);
  const { canInstall, install } = usePWAInstall();

  useEffect(() => {
    fetchGamificationProfile().then(({ data }) => setGProfile(data)).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside data-tour="sidebar" className="glass neon-border h-full w-64 flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="neon-text text-2xl font-bold tracking-widest">FX TODO</h1>
          <p className="text-xs text-slate-500 mt-1">Productivity System</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl lg:hidden">✕</button>
        )}
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon, label, tour }) => (
          <NavLink
            key={to}
            to={to}
            data-tour={tour}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-violet-600/20 neon-border text-violet-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            <span>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-white/10 mt-4">
        <div data-tour="xp-bar" className="mb-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span className="neon-text font-semibold">Lvl {gProfile?.level ?? user?.level ?? 1}</span>
            <span>{gProfile?.xp ?? user?.xp ?? 0} XP</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div
              className="bg-violet-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${gProfile?.progress ?? 0}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-200 truncate">{user?.username || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        {canInstall && (
          <button onClick={install} className="w-full text-sm text-violet-400 hover:text-violet-300 transition-colors text-left px-4 py-2 rounded-lg hover:bg-violet-500/10 mb-1">
            📲 Install App
          </button>
        )}
        <button onClick={handleLogout} className="w-full text-sm text-slate-400 hover:text-red-400 transition-colors text-left px-4 py-2 rounded-lg hover:bg-red-500/10">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 z-50">
        <SidebarContent />
      </div>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 glass neon-border rounded-lg flex items-center justify-center text-slate-300"
      >
        ☰
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 z-50"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
