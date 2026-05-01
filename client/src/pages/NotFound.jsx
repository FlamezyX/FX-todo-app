import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl mb-6">🌌</p>
      <h1 className="text-6xl font-bold neon-text mb-4">404</h1>
      <p className="text-slate-400 text-lg mb-2">Page not found</p>
      <p className="text-slate-600 text-sm mb-8">The page you're looking for doesn't exist in this dimension.</p>
      <button
        onClick={() => navigate('/dashboard')}
        className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-all neon-glow"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
