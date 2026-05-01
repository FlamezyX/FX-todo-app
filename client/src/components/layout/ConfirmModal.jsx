import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <AnimatePresence>
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[250] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="glass neon-border rounded-2xl p-6 w-full max-w-sm"
      >
        <p className="text-slate-200 text-sm mb-6 text-center">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-slate-200 text-sm transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
);

export default ConfirmModal;
