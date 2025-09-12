import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

export interface UserNotification {
  id: string;
  type: 'order_confirmed' | 'order_preparing' | 'order_ready' | 'order_delivered' | 'promotion';
  title: string;
  message: string;
  orderId?: string;
  timestamp: Date;
  isRead: boolean;
  isAdmin: false; // Always false for user notifications
}

interface UserNotificationContextType {
  notifications: UserNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<UserNotification, 'id' | 'timestamp' | 'isRead' | 'isAdmin'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const UserNotificationContext = createContext<UserNotificationContextType | undefined>(undefined);

interface UserNotificationProviderProps {
  children: ReactNode;
}

export const UserNotificationProvider: React.FC<UserNotificationProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  // Load notifications from localStorage (user-specific)
  useEffect(() => {
    if (!currentUser) return;

    const savedKey = `userNotifications_${currentUser.uid}`;
    const savedNotifications = localStorage.getItem(savedKey);
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications).map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }));
        setNotifications(parsed);
        console.log('🔔 User notifications loaded from localStorage:', parsed.length);
      } catch (error) {
        console.error('❌ Error parsing saved user notifications:', error);
      }
    }
  }, [currentUser]);

  // Save to localStorage whenever notifications change (user-specific)
  useEffect(() => {
    if (!currentUser || notifications.length === 0) return;

    const savedKey = `userNotifications_${currentUser.uid}`;
    localStorage.setItem(savedKey, JSON.stringify(notifications));
  }, [notifications, currentUser]);

  // Real-time listener for user's order status changes
  useEffect(() => {
    if (!currentUser) return;

    console.log('🔔 Setting up user order status listener...');

    const ordersRef = collection(db, 'orders');
    const userOrderQuery = query(
      ordersRef,
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(userOrderQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const orderData = change.doc.data();
          
          // Skip test orders
          if (orderData.isTestOrder) return;

          const statusMessages = {
            confirmed: 'Siparişiniz onaylandı ve hazırlanmaya başlandı!',
            preparing: 'Siparişiniz şu anda hazırlanıyor...',
            ready: 'Siparişiniz hazır! Kurye yola çıktı.',
            delivered: 'Siparişiniz teslim edildi. Afiyet olsun!'
          };

          const statusTitles = {
            confirmed: 'Sipariş Onaylandı',
            preparing: 'Sipariş Hazırlanıyor',
            ready: 'Sipariş Hazır',
            delivered: 'Sipariş Teslim Edildi'
          };

          const status = orderData.status as keyof typeof statusMessages;
          if (statusMessages[status]) {
            const notification: UserNotification = {
              id: `user_status_${change.doc.id}_${status}_${Date.now()}`,
              type: `order_${status}` as UserNotification['type'],
              title: statusTitles[status],
              message: statusMessages[status],
              orderId: change.doc.id,
              timestamp: new Date(),
              isRead: false,
              isAdmin: false
            };

            setNotifications(prev => [notification, ...prev]);

            // Browser notification for users
            if (Notification.permission === 'granted') {
              new Notification(notification.title, {
                body: notification.message,
                icon: '/icons/icon-192x192.png'
              });
            }

            console.log('🔔 New user notification:', notification);
          }
        }
      });
    }, (error) => {
      console.error('❌ User notification listener error:', error);
    });

    return () => {
      console.log('🔚 Cleaning up user order listener');
      unsubscribe();
    };
  }, [currentUser]);

  const addNotification = (notificationData: Omit<UserNotification, 'id' | 'timestamp' | 'isRead' | 'isAdmin'>) => {
    const notification: UserNotification = {
      ...notificationData,
      id: `user_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      isRead: false,
      isAdmin: false
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
    if (!currentUser) return;
    
    setNotifications([]);
    const savedKey = `userNotifications_${currentUser.uid}`;
    localStorage.removeItem(savedKey);
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const value: UserNotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <UserNotificationContext.Provider value={value}>
      {children}
    </UserNotificationContext.Provider>
  );
};

export const useUserNotifications = (): UserNotificationContextType => {
  const context = useContext(UserNotificationContext);
  if (!context) {
    throw new Error('useUserNotifications must be used within UserNotificationProvider');
  }
  return context;
};
