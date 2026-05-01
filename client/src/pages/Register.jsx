import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTutorialContext } from '../context/TutorialContext';
import api from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { startIfNew } = useTutorialContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const registerRes = await api.post('/auth/register', form);
      const loginRes = await api.post('/auth/login', { email: form.email, password: form.password });
      login(loginRes.data.user, loginRes.data.token);
      startIfNew();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass neon-border rounded-2xl p-8 w-full max-w-md">
        <h2 className="neon-text text-3xl font-bold mb-2 text-center">Create Account</h2>
        <p className="text-slate-500 text-sm text-center mb-8">Join the FX TODO system</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Username</label>
            <input
              type="text"
              placeholder="yourname"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all neon-glow"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
