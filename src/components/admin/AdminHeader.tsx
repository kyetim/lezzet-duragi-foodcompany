import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  ChevronDown,
  MessageSquare,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { useAdminNotifications } from '@/contexts/AdminNotificationContext';
import type { User as FirebaseUser } from 'firebase/auth';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  currentUser: FirebaseUser | null;
}

export function AdminHeader({ onToggleSidebar, currentUser }: AdminHeaderProps) {
  const { logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAdminNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-80">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Sipariş, müşteri veya ürün ara..."
              className="bg-transparent border-none outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <MessageSquare className="w-4 h-4 mr-1" />
              Mesajlar
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Settings className="w-4 h-4 mr-1" />
              Ayarlar
            </Button>
          </div>

          {/* Notifications - Real-time Notification System */}
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.displayName || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">Yönetici</p>
              </div>

              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-3 border-b border-gray-200">
                    <p className="font-medium text-gray-900">
                      {currentUser?.displayName || 'Admin Kullanıcı'}
                    </p>
                    <p className="text-sm text-gray-500">{currentUser?.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">Yönetici</span>
                    </div>
                  </div>

                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profil Ayarları
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Hesap Ayarları
                    </Button>
                  </div>

                  <div className="p-2 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
