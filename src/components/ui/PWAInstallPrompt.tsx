import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Bell, Heart, Zap, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePWA } from '@/hooks/usePWA';

interface PWAInstallPromptProps {
  onClose?: () => void;
  autoShow?: boolean;
}

type InstallStep = 'install' | 'notifications' | 'complete';

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  onClose,
  autoShow = true
}) => {
  const { isInstallable, install, requestNotificationPermission } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState<InstallStep>('install');

  useEffect(() => {
    if (autoShow && isInstallable) {
      // 2 saniye gecikme ile göster
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable, autoShow]);

  const handleInstall = async () => {
    try {
      await install();
      setStep('notifications');
    } catch (error) {
      console.error('Install error:', error);
    }
  };

  const handleNotifications = async () => {
    try {
      await requestNotificationPermission();
      setStep('complete');
      
      // 3 saniye sonra kapat
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Notification error:', error);
      setStep('complete');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const renderInstallStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Smartphone className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Uygulamayı Yükleyin! 📱
      </h2>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        Lezzet Durağı'nı ana ekranınıza ekleyerek daha hızlı ve kolay sipariş verin!
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center text-sm text-gray-700">
          <Zap className="w-4 h-4 text-orange-500 mr-2" />
          Hızlı Erişim
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <Wifi className="w-4 h-4 text-blue-500 mr-2" />
          Offline Çalışma
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <Bell className="w-4 h-4 text-green-500 mr-2" />
          Bildirimler
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <Heart className="w-4 h-4 text-red-500 mr-2" />
          Daha İyi UX
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={handleClose}
          className="flex-1"
        >
          Daha Sonra
        </Button>
        <Button
          onClick={handleInstall}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Download className="w-4 h-4 mr-2" />
          Yükle
        </Button>
      </div>
    </motion.div>
  );

  const renderNotificationsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Bell className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Bildirimleri Aktifleştirin! 🔔
      </h2>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        Siparişinizin durumu hakkında anında bilgilendirilmek ister misiniz?
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-center text-sm text-blue-800">
          <Bell className="w-4 h-4 mr-2" />
          <span>Sipariş onayı, hazırlık ve teslimat bildirimleri alacaksınız</span>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setStep('complete')}
          className="flex-1"
        >
          Atla
        </Button>
        <Button
          onClick={handleNotifications}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Bell className="w-4 h-4 mr-2" />
          Aktifleştir
        </Button>
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Harika! Hepsi Hazır 🎉
      </h2>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        Artık Lezzet Durağı'na ana ekranınızdan kolayca erişebilirsiniz!
      </p>
      
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-green-800">
          ✨ İyi ki yüklediniz! Şimdi daha hızlı sipariş verebilirsiniz.
        </p>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            {/* Close Button */}
            {step !== 'complete' && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            {/* Progress Indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                <div className={`w-2 h-2 rounded-full transition-colors ${
                  step === 'install' ? 'bg-orange-500' : 'bg-gray-300'
                }`} />
                <div className={`w-2 h-2 rounded-full transition-colors ${
                  step === 'notifications' ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <div className={`w-2 h-2 rounded-full transition-colors ${
                  step === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
            </div>
            
            {/* Content */}
            <AnimatePresence mode="wait">
              {step === 'install' && renderInstallStep()}
              {step === 'notifications' && renderNotificationsStep()}
              {step === 'complete' && renderCompleteStep()}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};