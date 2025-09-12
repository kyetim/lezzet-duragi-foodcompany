import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    X,
    CheckCheck,
    Trash2,
    Package,
    ShoppingBag,
    CreditCard,
    Info,
    Clock,
    Eye
} from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: any[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClearNotifications: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    isOpen,
    onClose,
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onClearNotifications
}) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order_status':
                return <Package className="w-5 h-5 text-blue-500" />;
            case 'new_order':
                return <ShoppingBag className="w-5 h-5 text-green-500" />;
            case 'payment':
                return <CreditCard className="w-5 h-5 text-purple-500" />;
            default:
                return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    const formatTime = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Şimdi';
        if (minutes < 60) return `${minutes}dk önce`;
        if (hours < 24) return `${hours}sa önce`;
        return `${days}g önce`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={onClose}
                    />

                    {/* Notification Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden"
                    >
                        <Card className="h-full rounded-none border-0">
                            {/* Header */}
                            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Bell className="w-5 h-5 text-blue-600" />
                                        Bildirimler
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" onClick={onClose}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Permission Request */}
                                {Notification.permission === 'default' && (
                                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800 mb-2">
                                            Anlık bildirimler için izin verin
                                        </p>
                                        <Button
                                            size="sm"
                                            onClick={() => Notification.requestPermission()}
                                            className="bg-yellow-600 hover:bg-yellow-700"
                                        >
                                            🔔 Bildirimleri Etkinleştir
                                        </Button>
                                    </div>
                                )}

                                {/* Filter Tabs */}
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        variant={filter === 'all' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setFilter('all')}
                                        className="text-xs"
                                    >
                                        Tümü ({notifications.length})
                                    </Button>
                                    <Button
                                        variant={filter === 'unread' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setFilter('unread')}
                                        className="text-xs"
                                    >
                                        Okunmamış ({unreadCount})
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* Actions */}
                            {notifications.length > 0 && (
                                <div className="p-3 border-b bg-gray-50 flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onMarkAllAsRead}
                                        disabled={unreadCount === 0}
                                        className="text-xs"
                                    >
                                        <CheckCheck className="w-3 h-3 mr-1" />
                                        Tümünü Okundu İşaretle
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onClearNotifications}
                                        className="text-xs text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Temizle
                                    </Button>
                                </div>
                            )}

                            {/* Notifications List */}
                            <CardContent className="p-0 flex-1 overflow-y-auto">
                                {filteredNotifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
                                        <Bell className="w-12 h-12 mb-4 text-gray-300" />
                                        <p className="text-lg font-medium">
                                            {filter === 'unread' ? 'Okunmamış bildirim yok' : 'Henüz bildirim yok'}
                                        </p>
                                        <p className="text-sm text-center mt-2">
                                            {filter === 'unread'
                                                ? 'Tüm bildirimlerinizi okudunuz!'
                                                : 'Yeni bildirimler burada görünecek'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {filteredNotifications.map((notification) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                                    }`}
                                                onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                                                }`}>
                                                                {notification.title}
                                                            </h4>
                                                            {!notification.isRead && (
                                                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                                                            )}
                                                        </div>

                                                        <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'
                                                            }`}>
                                                            {notification.message}
                                                        </p>

                                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                                            <Clock className="w-3 h-3" />
                                                            {formatTime(notification.timestamp)}
                                                            {notification.isRead && (
                                                                <>
                                                                    <span>•</span>
                                                                    <Eye className="w-3 h-3" />
                                                                    <span>Okundu</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
