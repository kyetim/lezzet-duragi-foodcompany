import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Store,
    Clock,
    CreditCard,
    Bell,
    Save,
    Truck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';

export function AdminSettings() {
    const [activeTab, setActiveTab] = useState<'general' | 'hours' | 'delivery' | 'payment' | 'notifications'>('general');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Başarılı', 'Ayarlar kaydedildi');
        } catch (error) {
            toast.error('Hata', 'Ayarlar kaydedilemedi');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'Genel', icon: Store },
        { id: 'hours', label: 'Çalışma Saatleri', icon: Clock },
        { id: 'delivery', label: 'Teslimat', icon: Truck },
        { id: 'payment', label: 'Ödeme', icon: CreditCard },
        { id: 'notifications', label: 'Bildirimler', icon: Bell }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        Sistem Ayarları
                    </h1>
                    <p className="text-gray-600">Restoran ayarlarını yönetin</p>
                </div>
                <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-0">
                            <nav className="space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${activeTab === tab.id
                                                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                                                    : 'text-gray-700'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {tabs.find(t => t.id === activeTab)?.label} Ayarları
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activeTab === 'general' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Restoran Adı
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Lezzet Durağı"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Telefon
                                            </label>
                                            <input
                                                type="tel"
                                                defaultValue="+90 555 000 0000"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Adres
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Örnek Mahalle, İstanbul"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'hours' && (
                                <div className="space-y-4">
                                    <p className="text-gray-600">Çalışma saatleri ayarları geliştiriliyor...</p>
                                </div>
                            )}

                            {activeTab === 'delivery' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ücretsiz Teslimat Limiti (₺)
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue="50"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Teslimat Ücreti (₺)
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue="10"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'payment' && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <span>Kapıda Nakit Ödeme</span>
                                            <input type="checkbox" defaultChecked className="rounded" />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <span>Kredi Kartı</span>
                                            <input type="checkbox" defaultChecked className="rounded" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <span>Yeni Siparişler</span>
                                            <input type="checkbox" defaultChecked className="rounded" />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <span>Sipariş Güncellemeleri</span>
                                            <input type="checkbox" defaultChecked className="rounded" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
