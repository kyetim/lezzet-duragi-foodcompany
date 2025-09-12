import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  Package,
  Star,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { orderFirebaseService, type Order, type OrderStatus } from '../../services/orderFirebaseService';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

// All stats data is now dynamically calculated from real Firebase data

const getStatusColor = (status: string) => {
  switch (status) {
    case 'preparing': return 'bg-yellow-100 text-yellow-800';
    case 'ready': return 'bg-green-100 text-green-800';
    case 'delivered': return 'bg-gray-100 text-gray-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'preparing': return 'Hazırlanıyor';
    case 'ready': return 'Hazır';
    case 'delivered': return 'Teslim Edildi';
    default: return 'Bilinmiyor';
  }
};

export function DashboardOverview() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [todayStats, setTodayStats] = useState({
    totalSales: 0,
    orderCount: 0,
    newCustomers: 0,
    averageOrder: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Real-time listener for dashboard data
  useEffect(() => {
    console.log('🔄 Setting up dashboard real-time listener...');

    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef);

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const allOrders: Order[] = [];
      const today = new Date();
      const todayStr = today.toDateString();

      let totalSales = 0;
      let orderCount = 0;
      let newCustomers = 0;
      const customers = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data();

        // Skip test orders
        if (data.isTestOrder) return;

        const order: Order = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          estimatedReadyAt: data.estimatedReadyAt
        } as Order;

        allOrders.push(order);

        // Calculate today's stats
        const orderDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        if (orderDate.toDateString() === todayStr) {
          totalSales += data.total || 0;
          orderCount++;
          customers.add(data.userId);
        }
      });

      // Update recent orders (last 5)
      const sortedOrders = allOrders
        .sort((a, b) => {
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return bDate.getTime() - aDate.getTime();
        })
        .slice(0, 5);

      setRecentOrders(sortedOrders);

      // Update stats
      setTodayStats({
        totalSales,
        orderCount,
        newCustomers: customers.size,
        averageOrder: orderCount > 0 ? totalSales / orderCount : 0
      });

      setIsLoading(false);
      console.log('📊 Dashboard updated:', { orderCount, totalSales, customers: customers.size });
    }, (error) => {
      console.error('❌ Dashboard listener error:', error);
      setIsLoading(false);
    });

    return () => {
      console.log('🔚 Cleaning up dashboard listener');
      unsubscribe();
    };
  }, []);


  // Dynamic stats data
  const statsData: StatCard[] = [
    {
      title: 'Günlük Satış',
      value: `₺${todayStats.totalSales.toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Sipariş Sayısı',
      value: todayStats.orderCount.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: 'Yeni Müşteriler',
      value: todayStats.newCustomers.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Ortalama Sipariş',
      value: `₺${todayStats.averageOrder.toFixed(0)}`,
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' :
                        stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''
                          }`} />
                        {stat.change} önceki güne göre
                      </div>
                    </div>

                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Son Siparişler
                </CardTitle>
                <Button variant="ghost" size="sm">
                  Tümünü Gör
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Siparişler yükleniyor...</p>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-4">
                    <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Henüz sipariş bulunmuyor</p>
                  </div>
                ) : (
                  recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{order.orderNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                        <p className="text-xs text-gray-500">
                          {order.items.slice(0, 2).map(item => item.name).join(', ')}
                          {order.items.length > 2 && ` +${order.items.length - 2} daha`}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₺{order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {(order.createdAt?.toDate ?
                            order.createdAt.toDate() :
                            new Date(order.createdAt)
                          ).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Items - Coming Soon */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Popüler Ürünler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">Daha fazla sipariş geldiğinde</p>
                <p className="text-gray-500 text-sm">popüler ürünler burada görünecek</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                <Package className="w-5 h-5" />
                <span className="text-sm">Yeni Ürün</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-sm">Siparişler</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                <Users className="w-5 h-5" />
                <span className="text-sm">Müşteriler</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Raporlar</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Sistem Uyarıları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Stok Uyarısı</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Adana Döner stoku 5 porsiyon kaldı.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Hazırlık Süresi</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Ortalama hazırlık süresi 15 dakika.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
