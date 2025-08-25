import { useToast as useToastContext } from '../contexts/ToastContext';

export const useToast = () => {
  const context = useToastContext();

  const toast = {
    success: (title: string, message?: string, duration?: number) => {
      context.addToast({
        type: 'success',
        title,
        message,
        duration,
      });
    },
    
    error: (title: string, message?: string, duration?: number) => {
      context.addToast({
        type: 'error',
        title,
        message,
        duration: duration || 7000, // Error messages stay longer by default
      });
    },
    
    warning: (title: string, message?: string, duration?: number) => {
      context.addToast({
        type: 'warning',
        title,
        message,
        duration,
      });
    },
    
    info: (title: string, message?: string, duration?: number) => {
      context.addToast({
        type: 'info',
        title,
        message,
        duration,
      });
    },
    
    custom: context.addToast,
    remove: context.removeToast,
    clear: context.clearAllToasts,
  };

  return toast;
};