import { useState, useEffect, useRef } from 'react';
import { fetchNotifications, markAllRead, markRead, deleteNotification } from '../../api/notifications';

const typeIcon = { task: '✅', habit: '🔁', goal: '🎯', achievement: '🏆', system: '🔔' };

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const load = async () => {
    try {
      const { data } = await fetchNotifications();
      setNotifications(data.notifications);
      setUnread(data.unread);
    } catch (_) {}
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read_status: true })));
    setUnread(0);
  };

  const handleMarkRead = async (id) => {
    await markRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read_status: true } : n));
    setUnread((prev) => Math.max(0, prev - 1));
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteNotification(id);
    const notif = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (!notif?.read_status) setUnread((prev) => Math.max(0, prev - 1));
  };

  // Browser notification
  const requestBrowserPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => { requestBrowserPermission(); }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="text-lg">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 glass neon-border rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-sm font-semibold text-slate-200">Notifications</span>
            {unread > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-8">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read_status && handleMarkRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0 cursor-pointer transition-colors hover:bg-white/5 ${
                    !n.read_status ? 'bg-violet-500/5' : ''
                  }`}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon[n.type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-semibold truncate ${!n.read_status ? 'text-slate-200' : 'text-slate-400'}`}>
                        {n.title}
                      </p>
                      {!n.read_status && <span className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-slate-700 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, n.id)}
                    className="text-slate-700 hover:text-red-400 text-xs flex-shrink-0 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
