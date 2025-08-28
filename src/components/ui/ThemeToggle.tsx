import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Açık Tema' },
    { value: 'dark', icon: Moon, label: 'Koyu Tema' },
    { value: 'system', icon: Monitor, label: 'Sistem Teması' }
  ] as const;

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {themes.map(({ value, icon: Icon, label }) => (
          <motion.button
            key={value}
            onClick={() => setTheme(value)}
            className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
              theme === value
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={label}
          >
            <AnimatePresence>
              {theme === value && (
                <motion.div
                  layoutId="theme-indicator"
                  className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <Icon className="w-4 h-4 relative z-10" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

interface ThemeToggleButtonProps {
  className?: string;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  className = ''
}) => {
  const { theme, setTheme, isDark } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
      default:
        return Sun;
    }
  };

  const Icon = getIcon();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Şu anda: ${
        theme === 'light' ? 'Açık Tema' : 
        theme === 'dark' ? 'Koyu Tema' : 
        'Sistem Teması'
      }`}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
};