import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Download, RotateCcw, Bell, BellOff, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface PWAStatusIndicatorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showLabels?: boolean;
}

export const PWAStatusIndicator: React.FC<PWAStatusIndicatorProps> = ({
  position = 'bottom-right',
  showLabels = false
}) => {
  const {
    isOnline,
    isInstallable,
    isInstalled,
    isUpdateAvailable,
    install,
    update,
    requestNotificationPermission
  } = usePWA();

  const [notificationPermission, setNotificationPermission] = React.useState(
    typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'default'
  );

  React.useEffect(() => {
    // Permission durumunu dinle
    const checkPermission = () => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    };

    // İlk kontrol
    checkPermission();
    
    // Periyodik kontrol (permission değişebilir)
    const interval = setInterval(checkPermission, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const handleNotificationRequest = async () => {
    if (notificationPermission === 'default') {
      await requestNotificationPermission();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed ${positionClasses[position]} z-40`}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          {/* Network Status */}
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: isOnline ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              className={`p-1.5 rounded-lg ${
                isOnline 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}
              title={isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
            >
              {isOnline ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
            </motion.div>
            
            {showLabels && (
              <span className={`ml-2 text-xs font-medium ${
                isOnline ? 'text-green-700' : 'text-red-700'
              }`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            )}
          </div>

          {/* Install Status */}
          {(isInstallable || isInstalled) && (
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isInstallable ? install : undefined}
                disabled={isInstalled}
                className={`p-1.5 rounded-lg transition-colors ${
                  isInstalled
                    ? 'bg-green-100 text-green-600 cursor-default'
                    : isInstallable
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-default'
                }`}
                title={
                  isInstalled 
                    ? 'Uygulama yüklü' 
                    : isInstallable 
                    ? 'Uygulamayı yükle' 
                    : 'Yükleme mevcut değil'
                }
              >
                {isInstalled ? (
                  <Smartphone className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </motion.button>
              
              {showLabels && (
                <span className={`ml-2 text-xs font-medium ${
                  isInstalled 
                    ? 'text-green-700' 
                    : isInstallable 
                    ? 'text-blue-700' 
                    : 'text-gray-500'
                }`}>
                  {isInstalled ? 'Yüklü' : isInstallable ? 'Yükle' : 'N/A'}
                </span>
              )}
            </div>
          )}

          {/* Update Status */}
          {isUpdateAvailable && (
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={update}
                className="p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors cursor-pointer"
                title="Güncelleme mevcut"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
              
              {showLabels && (
                <span className="ml-2 text-xs font-medium text-orange-700">
                  Güncelle
                </span>
              )}
            </div>
          )}

          {/* Notification Status */}
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNotificationRequest}
              disabled={notificationPermission === 'denied'}
              className={`p-1.5 rounded-lg transition-colors ${
                notificationPermission === 'granted'
                  ? 'bg-green-100 text-green-600 cursor-default'
                  : notificationPermission === 'denied'
                  ? 'bg-red-100 text-red-600 cursor-default'
                  : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 cursor-pointer'
              }`}
              title={
                notificationPermission === 'granted' 
                  ? 'Bildirimler aktif' 
                  : notificationPermission === 'denied'
                  ? 'Bildirimler reddedildi'
                  : 'Bildirimleri aktifleştir'
              }
            >
              {notificationPermission === 'granted' ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </motion.button>
            
            {showLabels && (
              <span className={`ml-2 text-xs font-medium ${
                notificationPermission === 'granted' 
                  ? 'text-green-700' 
                  : notificationPermission === 'denied'
                  ? 'text-red-700'
                  : 'text-yellow-700'
              }`}>
                {notificationPermission === 'granted' 
                  ? 'Aktif' 
                  : notificationPermission === 'denied'
                  ? 'Reddedildi'
                  : 'İzin Ver'
                }
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};