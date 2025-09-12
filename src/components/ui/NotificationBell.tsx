import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing } from 'lucide-react';
import { Button } from './button';
import { NotificationCenter } from './NotificationCenter';

interface NotificationBellProps {
    notifications: any[];
    unreadCount: number;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClearNotifications: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
    notifications,
    unreadCount,
    onMarkAsRead,
    onMarkAllAsRead,
    onClearNotifications
}) => {
    const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

    const hasUnread = unreadCount > 0;

    return (
        <>
            <div className="relative">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsNotificationCenterOpen(true)}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <motion.div
                        animate={hasUnread ? { rotate: [0, -10, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5, repeat: hasUnread ? Infinity : 0, repeatDelay: 3 }}
                    >
                        {hasUnread ? (
                            <BellRing className="w-5 h-5 text-blue-600" />
                        ) : (
                            <Bell className="w-5 h-5 text-gray-600" />
                        )}
                    </motion.div>

                    {/* Unread Count Badge */}
                    <AnimatePresence>
                        {hasUnread && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                            >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* Permission Status Indicator */}
                    {Notification.permission !== 'granted' && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" />
                    )}

                    {/* Pulse Effect for Unread */}
                    {hasUnread && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-blue-400 opacity-20"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                </Button>
            </div>

            {/* Notification Center */}
            <NotificationCenter
                isOpen={isNotificationCenterOpen}
                onClose={() => setIsNotificationCenterOpen(false)}
                notifications={notifications}
                onMarkAsRead={onMarkAsRead}
                onMarkAllAsRead={onMarkAllAsRead}
                onClearNotifications={onClearNotifications}
            />
        </>
    );
};
