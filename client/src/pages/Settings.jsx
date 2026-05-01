import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { fetchSettingsProfile, updateProfile, changePassword, updatePreferences } from '../api/settings';

const Section = ({ title, children }) => (
  <div className="glass neon-border rounded-xl p-6 mb-6">
    <h3 className="text-slate-300 font-semibold mb-5">{title}</h3>
    {children}
  </div>
);

const Toggle = ({ label, desc, value, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <div>
      <p className="text-sm text-slate-200">{label}</p>
      {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${value ? 'bg-violet-600' : 'bg-white/10'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${value ? 'left-5' : 'left-0.5'}`} />
    </button>
  </div>
);

const Settings = () => {
  const { user, login } = useAuth();
  const { accentColor, setAccentColor, timeFormat, setTimeFormat, ACCENT_COLORS } = useTheme();

  const [profile, setProfile] = useState({ username: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notifs, setNotifs] = useState({ notif_tasks: true, notif_habits: true, notif_goals: true });
  const [browserPerm, setBrowserPerm] = useState('default');
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    fetchSettingsProfile().then(({ data }) => {
      setProfile({ username: data.username, email: data.email });
      setNotifs({ notif_tasks: !!data.notif_tasks, notif_habits: !!data.notif_habits, notif_goals: !!data.notif_goals });
      if (data.accent_color) setAccentColor(data.accent_color);
      if (data.time_format) setTimeFormat(data.time_format);
    }).catch(console.error);
    if ('Notification' in window) setBrowserPerm(Notification.permission);
  }, []);

  const setMsg = (key, msg, isError = false) => {
    setMessages((prev) => ({ ...prev, [key]: { msg, isError } }));
    setTimeout(() => setMessages((prev) => ({ ...prev, [key]: null })), 3000);
  };

  const handleProfileSave = async () => {
    setLoading((p) => ({ ...p, profile: true }));
    try {
      const { data } = await updateProfile(profile);
      login(data, localStorage.getItem('token'));
      setMsg('profile', '✓ Profile updated');
    } catch (err) {
      setMsg('profile', err.response?.data?.message || 'Failed', true);
    } finally {
      setLoading((p) => ({ ...p, profile: false }));
    }
  };

  const handlePasswordSave = async () => {
    if (passwords.newPassword !== passwords.confirmPassword)
      return setMsg('password', 'Passwords do not match', true);
    setLoading((p) => ({ ...p, password: true }));
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMsg('password', '✓ Password changed');
    } catch (err) {
      setMsg('password', err.response?.data?.message || 'Failed', true);
    } finally {
      setLoading((p) => ({ ...p, password: false }));
    }
  };

  const handlePrefsSave = async () => {
    setLoading((p) => ({ ...p, prefs: true }));
    try {
      await updatePreferences({ ...notifs, time_format: timeFormat, accent_color: accentColor });
      setMsg('prefs', '✓ Preferences saved');
    } catch (err) {
      setMsg('prefs', 'Failed to save', true);
    } finally {
      setLoading((p) => ({ ...p, prefs: false }));
    }
  };

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setBrowserPerm(perm);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors";

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Settings <span className="neon-text">⚙️</span></h2>
        <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl">
        {/* Profile */}
        <Section title="👤 Profile">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center text-2xl font-bold text-white">
              {profile.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-slate-200 font-semibold">{profile.username}</p>
              <p className="text-slate-500 text-sm">{profile.email}</p>
              <p className="text-xs text-slate-600 mt-1">Level {user?.level ?? 1} · {user?.xp ?? 0} XP</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Username</label>
              <input type="text" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} />
            </div>
            {messages.profile && (
              <p className={`text-xs ${messages.profile.isError ? 'text-red-400' : 'text-green-400'}`}>{messages.profile.msg}</p>
            )}
            <button onClick={handleProfileSave} disabled={loading.profile} className="mt-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all neon-glow">
              {loading.profile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </Section>

        {/* Password */}
        <Section title="🔐 Change Password">
          <div className="flex flex-col gap-3">
            {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                <input type="password" value={passwords[key]} onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })} placeholder="••••••••" className={inputClass} />
              </div>
            ))}
            {messages.password && (
              <p className={`text-xs ${messages.password.isError ? 'text-red-400' : 'text-green-400'}`}>{messages.password.msg}</p>
            )}
            <button onClick={handlePasswordSave} disabled={loading.password} className="mt-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all neon-glow">
              {loading.password ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </Section>

        {/* Theme */}
        <Section title="🎨 Appearance">
          <div className="mb-5">
            <p className="text-sm text-slate-300 mb-3">Accent Color</p>
            <div className="flex gap-3 flex-wrap">
              {ACCENT_COLORS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setAccentColor(value)}
                  title={label}
                  className={`w-8 h-8 rounded-full transition-all ${accentColor === value ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f] scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: value }}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-300 mb-3">Time Format</p>
            <div className="flex gap-2">
              {['12h', '24h'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setTimeFormat(fmt)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${timeFormat === fmt ? 'bg-violet-600 text-white neon-glow' : 'bg-white/5 text-slate-400 hover:text-slate-200'}`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="🔔 Notifications">
          <div className="mb-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="text-sm text-slate-200">Browser Push Notifications</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Status: <span className={browserPerm === 'granted' ? 'text-green-400' : 'text-yellow-400'}>{browserPerm}</span>
                </p>
              </div>
              {browserPerm !== 'granted' ? (
                <button onClick={requestBrowserPermission} className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs rounded-lg transition-all">Enable</button>
              ) : (
                <span className="text-green-400 text-sm">✓ Enabled</span>
              )}
            </div>
          </div>
          <Toggle label="Task Reminders" desc="Deadline approaching alerts" value={notifs.notif_tasks} onChange={(v) => setNotifs({ ...notifs, notif_tasks: v })} />
          <Toggle label="Habit Reminders" desc="Daily habit completion reminders" value={notifs.notif_habits} onChange={(v) => setNotifs({ ...notifs, notif_habits: v })} />
          <Toggle label="Goal Updates" desc="Goal deadline and progress alerts" value={notifs.notif_goals} onChange={(v) => setNotifs({ ...notifs, notif_goals: v })} />
          {messages.prefs && (
            <p className={`text-xs mt-3 ${messages.prefs.isError ? 'text-red-400' : 'text-green-400'}`}>{messages.prefs.msg}</p>
          )}
          <button onClick={handlePrefsSave} disabled={loading.prefs} className="mt-5 w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all neon-glow">
            {loading.prefs ? 'Saving...' : 'Save All Preferences'}
          </button>
        </Section>
      </div>
    </div>
  );
};

export default Settings;
