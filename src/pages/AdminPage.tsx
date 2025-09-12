import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    BarChart3,
    Settings,
    Package
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Admin component imports (will create these)
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import MenuManagement from '../components/admin/MenuManagement';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { CustomerManagement } from '@/components/admin/CustomerManagement';
import { AnalyticsView } from '@/components/admin/AnalyticsView';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { initializeMenuData } from '../utils/initializeMenuData';
import { createOrdersCollection } from '../utils/createOrdersCollection';
import { createTestOrder } from '../utils/createTestOrder';

type AdminView = 'dashboard' | 'menu' | 'orders' | 'customers' | 'analytics' | 'settings';

const adminMenuItems = [
    {
        id: 'dashboard' as const,
        title: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Genel bakış ve önemli metriks'
    },
    {
        id: 'menu' as const,
        title: 'Menü Yönetimi',
        icon: Package,
        description: 'Ürün ekleme, düzenleme ve kategori yönetimi'
    },
    {
        id: 'orders' as const,
        title: 'Sipariş Yönetimi',
        icon: ShoppingBag,
        description: 'Gelen siparişler ve durum takibi'
    },
    {
        id: 'customers' as const,
        title: 'Müşteri Yönetimi',
        icon: Users,
        description: 'Müşteri bilgileri ve istatistikleri'
    },
    {
        id: 'analytics' as const,
        title: 'Raporlar & Analitik',
        icon: BarChart3,
        description: 'Satış raporları ve veri analizi'
    },
    {
        id: 'settings' as const,
        title: 'Ayarlar',
        icon: Settings,
        description: 'Sistem ayarları ve konfigürasyon'
    }
];

export default function AdminPage() {
    const { currentUser } = useAuth();
    const [currentView, setCurrentView] = useState<AdminView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check admin authorization
    useEffect(() => {
        const checkAdminAuth = async () => {
            if (!currentUser) {
                setIsLoading(false);
                return;
            }

            try {
                // Check if user has admin role
                // For now, we'll use a simple email check
                // In production, you'd check Firestore custom claims or user roles
                const adminEmails = [
                    'admin@lezzetduragi.com',
                    'yonetim@lezzetduragi.com',
                    currentUser.email // Temporarily allow current user for development
                ];

                const hasAdminAccess = adminEmails.includes(currentUser.email || '');
                setIsAuthorized(hasAdminAccess);

                // Initialize collections if user is admin
                if (hasAdminAccess) {
                    try {
                        // Create a test order to initialize orders collection
                        console.log('🔧 Initializing orders collection...');
                        await createTestOrder();
                        console.log('✅ Orders collection initialized with test order');

                        // Initialize menu data
                        await initializeMenuData();
                    } catch (error) {
                        console.warn('Initialization failed:', error);
                        // Don't block admin access if initialization fails
                    }
                }
            } catch (error) {
                console.error('Admin auth check error:', error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminAuth();
    }, [currentUser]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Admin erişimi kontrol ediliyor...</p>
                </div>
            </div>
        );
    }

    // Redirect if not logged in
    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    // Unauthorized access
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-red-600">Yetkisiz Erişim</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-gray-600">
                            Admin paneline erişim yetkiniz bulunmamaktadır.
                        </p>
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="w-full"
                        >
                            Geri Dön
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardOverview />;
            case 'menu':
                return <MenuManagement />;
            case 'orders':
                return <OrderManagement />;
            case 'customers':
                return <CustomerManagement />;
            case 'analytics':
                return <AnalyticsView />;
            case 'settings':
                return <AdminSettings />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <AdminHeader
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                currentUser={currentUser}
            />

            <div className="flex">
                {/* Sidebar */}
                <AdminSidebar
                    isOpen={isSidebarOpen}
                    currentView={currentView}
                    onViewChange={(view) => setCurrentView(view as AdminView)}
                    menuItems={adminMenuItems}
                />

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
                    <div className="p-6">
                        {/* Page Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {adminMenuItems.find(item => item.id === currentView)?.title}
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        {adminMenuItems.find(item => item.id === currentView)?.description}
                                    </p>
                                </div>

                                {/* Quick Stats */}
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Bugün</p>
                                        <p className="text-lg font-semibold text-green-600">₺1,240</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Siparişler</p>
                                        <p className="text-lg font-semibold text-blue-600">23</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Current View Content */}
                        <motion.div
                            key={currentView}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderCurrentView()}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
