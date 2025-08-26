import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import { useToast, type Toast, type ToastType } from '../../contexts/ToastContext';

const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -50, scale: 0.95 }
};

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-600" fill="currentColor" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-red-600" fill="currentColor" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-600" fill="currentColor" />;
    case 'info':
      return <Info className="w-5 h-5 text-blue-600" fill="currentColor" />;
    default:
      return <Info className="w-5 h-5 text-blue-600" fill="currentColor" />;
  }
};

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-900 shadow-green-100';
    case 'error':
      return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-900 shadow-red-100';
    case 'warning':
      return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 text-yellow-900 shadow-yellow-100';
    case 'info':
      return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-900 shadow-blue-100';
    default:
      return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-900 shadow-blue-100';
  }
};

interface ToastItemProps {
  toast: Toast;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { removeToast } = useToast();

  return (
    <motion.div
      key={toast.id}
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className={`
        relative flex items-start p-4 rounded-xl border shadow-xl max-w-sm w-full backdrop-blur-sm
        ${getToastStyles(toast.type)}
      `}
    >
      <div className="flex-shrink-0 mr-3">
        {getToastIcon(toast.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium leading-5">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="mt-1 text-sm opacity-90">
            {toast.message}
          </p>
        )}
      </div>
      
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-3 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-20 right-4 z-[150] space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};