import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TutorialProvider } from './context/TutorialContext';
import { ToastProvider } from './context/ToastContext';
import TourOverlay from './components/tutorial/TourOverlay';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Timeline from './pages/Timeline';
import Gamification from './pages/Gamification';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import OfflineBanner from './components/layout/OfflineBanner';
import Today from './pages/Today';
import Pomodoro from './pages/Pomodoro';
import PageTransition from './components/layout/PageTransition';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center neon-text text-xl">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center neon-text text-xl">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="today" element={<PageTransition><Today /></PageTransition>} />
        <Route path="tasks" element={<PageTransition><Tasks /></PageTransition>} />
        <Route path="goals" element={<PageTransition><Goals /></PageTransition>} />
        <Route path="habits" element={<PageTransition><Habits /></PageTransition>} />
        <Route path="gamification" element={<PageTransition><Gamification /></PageTransition>} />
        <Route path="timeline" element={<PageTransition><Timeline /></PageTransition>} />
        <Route path="pomodoro" element={<PageTransition><Pomodoro /></PageTransition>} />
        <Route path="settings" element={<PageTransition><Settings /></PageTransition>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <HashRouter>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <TutorialProvider>
            <OfflineBanner />
            <TourOverlay />
            <AppRoutes />
          </TutorialProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </HashRouter>
);

export default App;
