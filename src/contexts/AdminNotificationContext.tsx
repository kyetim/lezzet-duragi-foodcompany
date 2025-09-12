import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

export interface AdminNotification {
  id: string;
  type: 'new_order' | 'order_status_change' | 'system_alert';
  title: string;
  message: string;
  orderId?: string;
  customerName?: string;
  timestamp: Date;
  isRead: boolean;
  isAdmin: true; // Always true for admin notifications
}

interface AdminNotificationContextType {
  notifications: AdminNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'isRead' | 'isAdmin'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const AdminNotificationContext = createContext<AdminNotificationContextType | undefined>(undefined);

interface AdminNotificationProviderProps {
  children: ReactNode;
}

export const AdminNotificationProvider: React.FC<AdminNotificationProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications).map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }));
        setNotifications(parsed);
        console.log('🔔 Admin notifications loaded from localStorage:', parsed.length);
      } catch (error) {
        console.error('❌ Error parsing saved admin notifications:', error);
      }
    }
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Real-time listener for new orders (Admin only)
  useEffect(() => {
    if (!currentUser) return;

    // Check if user is admin (you can expand this logic)
    const isUserAdmin = import.meta.env.DEV || currentUser.email?.includes('admin');
    
    if (!isUserAdmin) return;

    console.log('🔔 Setting up admin order listener...');

    const ordersRef = collection(db, 'orders');
    const adminOrderQuery = query(
      ordersRef,
      where('status', '==', 'confirmed') // Listen for new confirmed orders
    );

    const unsubscribe = onSnapshot(adminOrderQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const orderData = change.doc.data();
          
          // Skip test orders
          if (orderData.isTestOrder) return;

          const notification: AdminNotification = {
            id: `admin_order_${change.doc.id}_${Date.now()}`,
            type: 'new_order',
            title: 'Yeni Sipariş Alındı!',
            message: `${orderData.customerName} tarafından ₺${(orderData.total || 0).toFixed(2)} tutarında yeni sipariş`,
            orderId: change.doc.id,
            customerName: orderData.customerName,
            timestamp: new Date(),
            isRead: false,
            isAdmin: true
          };

          setNotifications(prev => [notification, ...prev]);

          // Browser notification for admins
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/icons/icon-192x192.png'
            });
          }

          console.log('🔔 New admin notification:', notification);
        }
      });
    }, (error) => {
      console.error('❌ Admin notification listener error:', error);
    });

    return () => {
      console.log('🔚 Cleaning up admin order listener');
      unsubscribe();
    };
  }, [currentUser]);

  // Custom event listener for dev mode
  useEffect(() => {
    const handleCustomAdminNotification = (event: CustomEvent) => {
      const notification: AdminNotification = {
        id: `admin_custom_${Date.now()}`,
        type: 'new_order',
        title: 'Yeni Sipariş Alındı! (Dev)',
        message: event.detail.message,
        orderId: event.detail.orderId,
        customerName: event.detail.customerName,
        timestamp: new Date(),
        isRead: false,
        isAdmin: true
      };

      setNotifications(prev => [notification, ...prev]);
      console.log('🔔 Admin custom notification received:', notification);
    };

    window.addEventListener('adminOrderNotification', handleCustomAdminNotification as EventListener);
    
    return () => {
      window.removeEventListener('adminOrderNotification', handleCustomAdminNotification as EventListener);
    };
  }, []);

  const addNotification = (notificationData: Omit<AdminNotification, 'id' | 'timestamp' | 'isRead' | 'isAdmin'>) => {
    const notification: AdminNotification = {
      ...notificationData,
      id: `admin_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      isRead: false,
      isAdmin: true
    };

    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('adminNotifications');
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const value: AdminNotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <AdminNotificationContext.Provider value={value}>
      {children}
    </AdminNotificationContext.Provider>
  );
};

export const useAdminNotifications = (): AdminNotificationContextType => {
  const context = useContext(AdminNotificationContext);
  if (!context) {
    throw new Error('useAdminNotifications must be used within AdminNotificationProvider');
  }
  return context;
};
