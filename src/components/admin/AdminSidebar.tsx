import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminMenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface AdminSidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
  menuItems: AdminMenuItem[];
}

export function AdminSidebar({ 
  isOpen, 
  currentView, 
  onViewChange, 
  menuItems 
}: AdminSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40"
    >
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-200">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LD</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Lezzet Durağı</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">LD</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                  "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500",
                  isActive ? "bg-primary-50 text-primary-700 border border-primary-200" : "text-gray-600"
                )}
              >
                <IconComponent className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-primary-600" : "text-gray-500"
                )} />
                
                {isOpen && (
                  <div className="flex-1 text-left">
                    <div className={cn(
                      "font-medium",
                      isActive ? "text-primary-900" : "text-gray-900"
                    )}>
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {item.description}
                    </div>
                  </div>
                )}

                {isActive && isOpen && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-primary-600 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Quick Stats (when open) */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 border-t border-gray-200 space-y-3"
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium">Bugünkü Satış</p>
                  <p className="text-lg font-bold text-green-700">₺1,240</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">Aktif Siparişler</p>
                  <p className="text-lg font-bold text-blue-700">8</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📦</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
