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

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

const statsData: StatCard[] = [
  {
    title: 'Günlük Satış',
    value: '₺1,240',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500'
  },
  {
    title: 'Sipariş Sayısı',
    value: '23',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingBag,
    color: 'bg-blue-500'
  },
  {
    title: 'Yeni Müşteriler',
    value: '5',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    title: 'Ortalama Sipariş',
    value: '₺54',
    change: '-2.1%',
    trend: 'down',
    icon: TrendingUp,
    color: 'bg-orange-500'
  }
];

const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'Ahmet Yılmaz',
    items: 'Adana Döner, Ayran',
    total: '₺45',
    status: 'preparing',
    time: '10:30'
  },
  {
    id: 'ORD-002',
    customer: 'Elif Kara',
    items: 'Tavuk Döner, Makarna',
    total: '₺65',
    status: 'ready',
    time: '10:25'
  },
  {
    id: 'ORD-003',
    customer: 'Mehmet Demir',
    items: 'Karışık Döner, Kola',
    total: '₺38',
    status: 'delivered',
    time: '10:15'
  }
];

const popularItems = [
  { name: 'Adana Döner', sold: 15, revenue: '₺540' },
  { name: 'Tavuk Döner', sold: 12, revenue: '₺420' },
  { name: 'Karışık Döner', sold: 8, revenue: '₺320' },
  { name: 'Makarna', sold: 6, revenue: '₺180' }
];

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
                      <div className={`flex items-center text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 
                        stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${
                          stat.trend === 'down' ? 'rotate-180' : ''
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
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.items}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{order.total}</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Items */}
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
              <div className="space-y-3">
                {popularItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.sold} adet satıldı</p>
                    </div>
                    <p className="font-semibold text-primary-600">{item.revenue}</p>
                  </motion.div>
                ))}
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
