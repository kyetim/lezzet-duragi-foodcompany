import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Package, Utensils, ShoppingCart } from 'lucide-react';

export type LoadingType = 'default' | 'page' | 'order' | 'cart' | 'food';

interface LoadingSpinnerProps {
  type?: LoadingType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const getLoadingIcon = (type: LoadingType) => {
  switch (type) {
    case 'order':
      return Package;
    case 'cart':
      return ShoppingCart;
    case 'food':
      return Utensils;
    default:
      return Loader2;
  }
};

const getSizeClasses = (size: 'sm' | 'md' | 'lg' | 'xl') => {
  switch (size) {
    case 'sm':
      return 'w-4 h-4';
    case 'md':
      return 'w-6 h-6';
    case 'lg':
      return 'w-8 h-8';
    case 'xl':
      return 'w-12 h-12';
    default:
      return 'w-6 h-6';
  }
};

const getLoadingText = (type: LoadingType) => {
  switch (type) {
    case 'page':
      return 'Sayfa yükleniyor...';
    case 'order':
      return 'Sipariş bilgileri yükleniyor...';
    case 'cart':
      return 'Sepet güncelleniyor...';
    case 'food':
      return 'Lezzetli yemekler yükleniyor...';
    default:
      return 'Yükleniyor...';
  }
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  type = 'default',
  size = 'md',
  text,
  className = '',
  fullScreen = false,
}) => {
  const LoadingIcon = getLoadingIcon(type);
  const displayText = text || getLoadingText(type);
  
  const spinner = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="mb-3"
      >
        <LoadingIcon className={`${getSizeClasses(size)} text-orange-500`} />
      </motion.div>
      {displayText && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 font-medium text-sm"
        >
          {displayText}
        </motion.p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Page Loading Component
export const PageLoading: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-6"
        >
          <div className="w-full h-full border-4 border-orange-200 border-t-orange-500 rounded-full"></div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-gray-800 mb-2"
        >
          Lezzet Durağı
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600"
        >
          {text || 'Lezzetli yemeklerimiz hazırlanıyor...'}
        </motion.p>
        
        {/* Floating food icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center space-x-4 mt-6"
        >
          {['🍽️', '🥗', '🍝', '🥤'].map((emoji, index) => (
            <motion.span
              key={index}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className="text-2xl"
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

// Inline Loading Component
export const InlineLoading: React.FC<{ text?: string; size?: 'sm' | 'md' }> = ({ 
  text = 'Yükleniyor...', 
  size = 'sm' 
}) => {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
      </motion.div>
      <span className={`font-medium ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
        {text}
      </span>
    </div>
  );
};

// Button Loading State
export const ButtonLoading: React.FC<{ text?: string }> = ({ text = 'İşleniyor...' }) => {
  return (
    <div className="flex items-center space-x-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-4 h-4" />
      </motion.div>
      <span>{text}</span>
    </div>
  );
};