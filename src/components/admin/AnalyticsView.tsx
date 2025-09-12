import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AnalyticsData {
  revenue: {
    today: number;
    week: number;
    month: number;
    growth: number;
  };
  orders: {
    today: number;
    week: number;
    month: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    growth: number;
  };
  products: {
    totalSold: number;
    mostPopular: string;
    averageOrderValue: number;
  };
  timeDistribution: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  topProducts: Array<{
    name: string;
    sold: number;
    revenue: number;
  }>;
}

interface TimeFilter {
  label: string;
  value: 'today' | 'week' | 'month' | 'year';
  days: number;
}

const timeFilters: TimeFilter[] = [
  { label: 'Bugün', value: 'today', days: 1 },
  { label: 'Bu Hafta', value: 'week', days: 7 },
  { label: 'Bu Ay', value: 'month', days: 30 },
  { label: 'Bu Yıl', value: 'year', days: 365 }
];

export function AnalyticsView() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>(timeFilters[2]); // Default to month
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('📊 Setting up analytics listener...');

    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef);

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const allOrders: any[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isTestOrder) return; // Skip test orders
        
        allOrders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        });
      });

      // Calculate analytics data
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const previousMonth = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Filter orders by time periods
      const todayOrders = allOrders.filter(o => o.createdAt >= today);
      const weekOrders = allOrders.filter(o => o.createdAt >= weekAgo);
      const monthOrders = allOrders.filter(o => o.createdAt >= monthAgo);
      const previousMonthOrders = allOrders.filter(o => 
        o.createdAt >= previousMonth && o.createdAt < monthAgo
      );

      // Calculate revenue
      const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const weekRevenue = weekOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const previousMonthRevenue = previousMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      const revenueGrowth = previousMonthRevenue > 0 
        ? ((monthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
        : 0;

      // Calculate customer data
      const allCustomers = new Set(allOrders.map(o => o.userId));
      const newCustomers = new Set(monthOrders.map(o => o.userId));
      const returningCustomers = allCustomers.size - newCustomers.size;

      // Calculate time distribution
      const timeDistribution = { morning: 0, afternoon: 0, evening: 0, night: 0 };
      monthOrders.forEach(order => {
        const hour = order.createdAt.getHours();
        if (hour >= 6 && hour < 12) timeDistribution.morning++;
        else if (hour >= 12 && hour < 18) timeDistribution.afternoon++;
        else if (hour >= 18 && hour < 24) timeDistribution.evening++;
        else timeDistribution.night++;
      });

      // Calculate top products
      const productSales = new Map<string, { sold: number; revenue: number }>();
      monthOrders.forEach(order => {
        order.items?.forEach((item: any) => {
          const existing = productSales.get(item.name) || { sold: 0, revenue: 0 };
          existing.sold += item.quantity || 1;
          existing.revenue += (item.price || 0) * (item.quantity || 1);
          productSales.set(item.name, existing);
        });
      });

      const topProducts = Array.from(productSales.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5);

      const totalItemsSold = Array.from(productSales.values())
        .reduce((sum, p) => sum + p.sold, 0);

      const analytics: AnalyticsData = {
        revenue: {
          today: todayRevenue,
          week: weekRevenue,
          month: monthRevenue,
          growth: revenueGrowth
        },
        orders: {
          today: todayOrders.length,
          week: weekOrders.length,
          month: monthOrders.length,
          growth: previousMonthOrders.length > 0 
            ? ((monthOrders.length - previousMonthOrders.length) / previousMonthOrders.length) * 100 
            : 0
        },
        customers: {
          total: allCustomers.size,
          new: newCustomers.size,
          returning: Math.max(0, returningCustomers),
          growth: 15.3 // Mock growth rate
        },
        products: {
          totalSold: totalItemsSold,
          mostPopular: topProducts[0]?.name || 'Henüz veri yok',
          averageOrderValue: monthOrders.length > 0 ? monthRevenue / monthOrders.length : 0
        },
        timeDistribution,
        topProducts
      };

      setAnalyticsData(analytics);
      setIsLoading(false);
      console.log('📊 Analytics updated:', analytics);
    });

    return () => {
      console.log('🔚 Cleaning up analytics listener');
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Analitik verileri yüklenemedi</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with Time Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raporlar & Analitik</h1>
          <p className="text-gray-600">İşletmenizin performansını takip edin</p>
        </div>
        <div className="flex gap-2">
          {timeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedFilter.value === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bu Ay Gelir</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{analyticsData.revenue.month.toFixed(2)}
                </p>
                <div className="flex items-center mt-1">
                  {analyticsData.revenue.growth >= 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    analyticsData.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(analyticsData.revenue.growth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bu Ay Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.orders.month}
                </p>
                <div className="flex items-center mt-1">
                  {analyticsData.orders.growth >= 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    analyticsData.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(analyticsData.orders.growth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.customers.total}
                </p>
                <p className="text-sm text-gray-500">
                  {analyticsData.customers.new} yeni bu ay
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ort. Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{analyticsData.products.averageOrderValue.toFixed(0)}
                </p>
                <p className="text-sm text-gray-500">
                  {analyticsData.products.totalSold} ürün satıldı
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Sipariş Saatleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analyticsData.timeDistribution).map(([period, count]) => {
                const total = Object.values(analyticsData.timeDistribution).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                const periodLabels = {
                  morning: '06:00 - 12:00',
                  afternoon: '12:00 - 18:00', 
                  evening: '18:00 - 24:00',
                  night: '00:00 - 06:00'
                };

                return (
                  <div key={period} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                      <span className="text-sm font-medium">{periodLabels[period as keyof typeof periodLabels]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              En Popüler Ürünler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Henüz veri bulunmuyor</p>
              ) : (
                analyticsData.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.sold} adet</p>
                      <p className="text-sm text-gray-500">₺{product.revenue.toFixed(0)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">En Çok Satan Ürün</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">{analyticsData.products.mostPopular}</p>
                <p className="text-sm text-gray-500">Bu ayın lideri</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bugünkü Performans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Gelir:</span>
                <span className="font-medium">₺{analyticsData.revenue.today.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sipariş:</span>
                <span className="font-medium">{analyticsData.orders.today} adet</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bu Haftaki Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Gelir:</span>
                <span className="font-medium">₺{analyticsData.revenue.week.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sipariş:</span>
                <span className="font-medium">{analyticsData.orders.week} adet</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}