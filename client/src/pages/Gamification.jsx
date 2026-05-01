import { useState, useEffect } from 'react';
import { fetchGamificationProfile } from '../api/gamification';

const AchievementCard = ({ achievement }) => (
  <div className={`glass rounded-xl p-4 border transition-all ${
    achievement.unlocked ? 'border-violet-500/40 bg-violet-500/5' : 'border-white/5 opacity-40'
  }`}>
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{achievement.icon}</span>
      <div>
        <p className={`text-sm font-semibold ${achievement.unlocked ? 'text-slate-200' : 'text-slate-500'}`}>
          {achievement.label}
        </p>
        {achievement.unlocked && achievement.unlocked_at && (
          <p className="text-xs text-slate-600">
            {new Date(achievement.unlocked_at).toLocaleDateString()}
          </p>
        )}
      </div>
      {achievement.unlocked && (
        <span className="ml-auto text-violet-400 text-lg">✓</span>
      )}
    </div>
    <p className="text-xs text-slate-500">{achievement.desc}</p>
  </div>
);

const Gamification = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamificationProfile()
      .then(({ data }) => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const unlockedCount = profile?.achievements.filter((a) => a.unlocked).length ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Gamification <span className="neon-text">🎮</span></h2>
        <p className="text-slate-500 text-sm mt-1">Your XP, level and achievements</p>
      </div>

      {/* Level & XP Card */}
      <div className="glass neon-border rounded-2xl p-8 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-violet-600/20 neon-border flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-xs text-slate-500">LEVEL</span>
            <span className="text-3xl font-bold neon-text">{profile?.level}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300 font-semibold">Level {profile?.level}</span>
              <span className="text-slate-500">{profile?.xp} / {profile?.nextLevelXP} XP</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-violet-600 to-violet-400 h-3 rounded-full transition-all duration-700 neon-glow"
                style={{ width: `${profile?.progress ?? 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {(profile?.nextLevelXP ?? 0) - (profile?.xp ?? 0)} XP to level {(profile?.level ?? 0) + 1}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <p className="text-xl font-bold text-violet-400">{profile?.xp}</p>
            <p className="text-xs text-slate-500 mt-1">Total XP</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <p className="text-xl font-bold text-yellow-400">{profile?.level}</p>
            <p className="text-xs text-slate-500 mt-1">Current Level</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <p className="text-xl font-bold text-green-400">{unlockedCount}/{profile?.achievements.length}</p>
            <p className="text-xs text-slate-500 mt-1">Achievements</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div>
          <h3 className="text-slate-300 font-semibold mb-4">Achievements</h3>
          <div className="grid grid-cols-1 gap-3">
            {profile?.achievements.map((a) => (
              <AchievementCard key={a.key} achievement={a} />
            ))}
          </div>
        </div>

        {/* XP Log */}
        <div>
          <h3 className="text-slate-300 font-semibold mb-4">Recent XP Activity</h3>
          <div className="glass neon-border rounded-xl p-4">
            {profile?.xpLogs.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-8">No XP earned yet. Complete tasks and habits!</p>
            ) : (
              <div className="flex flex-col gap-2">
                {profile.xpLogs.map((log, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm text-slate-300">{log.reason}</p>
                      <p className="text-xs text-slate-600">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                    <span className="text-violet-400 font-bold text-sm">+{log.amount} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* XP Rewards Reference */}
          <h3 className="text-slate-300 font-semibold mt-6 mb-4">How to Earn XP</h3>
          <div className="glass neon-border rounded-xl p-4">
            {[
              { label: 'Complete a task', xp: 20, icon: '✅' },
              { label: 'Complete a high priority task', xp: 35, icon: '🔥' },
              { label: 'Complete a habit', xp: 10, icon: '🔁' },
              { label: '7-day streak bonus', xp: 50, icon: '⚡' },
              { label: '30-day streak bonus', xp: 200, icon: '💎' },
            ].map(({ label, xp, icon }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="text-sm text-slate-400">{label}</span>
                </div>
                <span className="text-violet-400 font-semibold text-sm">+{xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;
