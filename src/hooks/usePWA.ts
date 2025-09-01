import { useState, useEffect } from 'react';
import { useToast } from './useToast';

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
}

interface PWAActions {
  install: () => Promise<void>;
  update: () => Promise<void>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
}

export const usePWA = (): PWAState & PWAActions => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const toast = useToast();

  useEffect(() => {
    registerServiceWorker();
    setupEventListeners();
    checkIfInstalled();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    // Development modunda Service Worker'ı devre dışı bırak ve mevcut olanları temizle
    if (import.meta.env.DEV) {
      console.log('🔧 Development modunda Service Worker devre dışı');
      await unregisterServiceWorker();
      return;
    }
    
    if ('serviceWorker' in navigator) {
      try {
        console.log('🔧 Service Worker kaydediliyor...');
        
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        setRegistration(reg);
        console.log('✅ Service Worker kaydedildi:', reg.scope);
        
        // Service Worker güncellemelerini dinle
        reg.addEventListener('updatefound', () => {
          console.log('🔄 Service Worker güncellemesi bulundu');
          const newWorker = reg.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('📦 Yeni Service Worker hazır');
                setIsUpdateAvailable(true);
                
                toast.info(
                  'Güncelleme Mevcut! 🔄',
                  'Yeni özellikler için sayfayı yenileyin'
                );
              }
            });
          }
        });
        
      } catch (error) {
        console.error('❌ Service Worker kayıt hatası:', error);
      }
    } else {
      console.warn('⚠️ Service Worker desteklenmiyor');
    }
  };

  const unregisterServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          console.log('🗑️ Service Worker kaydı siliniyor:', registration.scope);
          await registration.unregister();
        }
        
        // Cache'leri de temizle
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          console.log('🗑️ Cache siliniyor:', cacheName);
          await caches.delete(cacheName);
        }
        
        console.log('✅ Tüm Service Worker kayıtları ve cache\'ler temizlendi');
      } catch (error) {
        console.error('❌ Service Worker temizleme hatası:', error);
      }
    }
  };

  const setupEventListeners = () => {
    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('📱 PWA install prompt hazır');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Kullanıcıya bildir
      toast.info(
        'Uygulamayı Yükleyin! 📱',
        'Ana ekrana ekleyerek daha hızlı erişim sağlayın'
      );
    });

    // PWA installed event
    window.addEventListener('appinstalled', () => {
      console.log('🎉 PWA başarıyla yüklendi');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      
      toast.success(
        'Uygulama Yüklendi! 🎉',
        'Artık ana ekranınızdan erişebilirsiniz'
      );
    });

    // Network status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  };

  const handleOnline = () => {
    setIsOnline(true);
    console.log('🌐 Bağlantı restore edildi');
    toast.success('Çevrimiçi! 🌐', 'İnternet bağlantınız geri geldi');
  };

  const handleOffline = () => {
    setIsOnline(false);
    console.log('📱 Offline moda geçildi');
    toast.warning(
      'Çevrimdışı Mod 📱', 
      'Cached verilerle çalışmaya devam edebilirsiniz'
    );
  };

  const checkIfInstalled = () => {
    // PWA yüklü mü kontrol et
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      console.log('📱 PWA standalone modda çalışıyor');
    }
  };

  const install = async (): Promise<void> => {
    if (!deferredPrompt) {
      toast.warning('Yükleme Mevcut Değil', 'Uygulama zaten yüklü veya desteklenmiyor');
      return;
    }

    try {
      console.log('📱 PWA yükleme başlatılıyor...');
      
      // Install prompt'u göster
      const result = await deferredPrompt.prompt();
      console.log('📱 Install prompt sonucu:', result.outcome);
      
      if (result.outcome === 'accepted') {
        console.log('✅ Kullanıcı PWA yüklemeyi kabul etti');
        toast.info('Yükleniyor...', 'Uygulama ana ekranınıza ekleniyor');
      } else {
        console.log('❌ Kullanıcı PWA yüklemeyi reddetti');
        toast.warning('Yükleme İptal Edildi', 'İstediğiniz zaman ana menüden yükleyebilirsiniz');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
      
    } catch (error) {
      console.error('❌ PWA yükleme hatası:', error);
      toast.error('Yükleme Hatası', 'Uygulama yüklenirken bir hata oluştu');
    }
  };

  const update = async (): Promise<void> => {
    if (!registration) {
      console.warn('⚠️ Service Worker registration bulunamadı');
      return;
    }

    try {
      console.log('🔄 PWA güncelleme başlatılıyor...');
      
      // Yeni service worker'ı aktifleştir
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      // Sayfayı yenile
      window.location.reload();
      
    } catch (error) {
      console.error('❌ PWA güncelleme hatası:', error);
      toast.error('Güncelleme Hatası', 'Güncelleme sırasında bir hata oluştu');
    }
  };

  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('⚠️ Notification API desteklenmiyor');
      toast.warning('Bildirimler Desteklenmiyor', 'Tarayıcınız bildirimleri desteklemiyor');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Notification permission zaten verilmiş');
      return 'granted';
    }

    try {
      console.log('🔔 Notification permission isteniyor...');
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Notification permission verildi');
        toast.success(
          'Bildirimler Aktif! 🔔',
          'Sipariş durumunuz hakkında bilgilendirileceksiniz'
        );
        
        // Test bildirimi göster
        new Notification('Lezzet Durağı', {
          body: 'Bildirimler başarıyla aktifleştirildi!',
          icon: '/icons/icon-192x192.png'
        });
      } else {
        console.log('❌ Notification permission reddedildi');
        toast.warning(
          'Bildirimler Reddedildi',
          'Sipariş güncellemeleri için tarayıcı ayarlarından izin verebilirsiniz'
        );
      }
      
      return permission;
      
    } catch (error) {
      console.error('❌ Notification permission hatası:', error);
      return 'denied';
    }
  };

  return {
    // State
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    
    // Actions
    install,
    update,
    requestNotificationPermission
  };
};