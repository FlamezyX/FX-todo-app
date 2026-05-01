import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
const COLORS = {
  success: 'border-green-500/30 bg-green-500/10 text-green-300',
  error: 'border-red-500/30 bg-red-500/10 text-red-300',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
  info: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border glass shadow-xl min-w-64 max-w-sm ${COLORS[t.type]}`}
            >
              <span className="text-base flex-shrink-0">{ICONS[t.type]}</span>
              <p className="text-sm flex-1">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-xs opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">✕</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
