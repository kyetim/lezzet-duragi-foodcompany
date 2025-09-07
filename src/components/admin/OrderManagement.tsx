import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Eye,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { orderFirebaseService, type Order, type OrderStatus } from '../../services/orderFirebaseService';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Bekliyor' },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Onaylandı' },
  preparing: { color: 'bg-orange-100 text-orange-800', icon: Package, label: 'Hazırlanıyor' },
  ready: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Hazır' },
  on_way: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Yolda' },
  delivered: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, label: 'Teslim Edildi' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'İptal Edildi' }
};

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('🔄 Fetching orders for admin...');
        const allOrders = await orderFirebaseService.getAllOrders(50);
        setOrders(allOrders);
        console.log('✅ Orders loaded:', allOrders.length);
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderFirebaseService.updateOrderStatus(orderId, newStatus, 'admin', 'admin');

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      console.log('✅ Order status updated:', orderId, newStatus);
    } catch (error) {
      console.error('❌ Error updating order status:', error);
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: { [key in OrderStatus]: OrderStatus | null } = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'on_way',
      on_way: 'delivered',
      delivered: null,
      cancelled: null
    };
    return statusFlow[currentStatus];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Status Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Sipariş Durumu Filtresi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              Tümü ({orders.length})
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = orders.filter(order => order.status === status).length;
              const IconComponent = config.icon;

              return (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status as OrderStatus)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {config.label} ({count})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Sipariş Listesi ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Siparişler yükleniyor...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Bu durumda sipariş bulunmuyor</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const statusInfo = statusConfig[order.status];
                const StatusIcon = statusInfo.icon;
                const nextStatus = getNextStatus(order.status);

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-4 h-4 inline mr-1" />
                            {statusInfo.label}
                          </span>
                          <span className="text-sm text-gray-500">
                            {order.createdAt.toDate().toLocaleString('tr-TR')}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{order.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{order.customerPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-xs">{order.deliveryAddress.address}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Ürünler: </span>
                              <span className="text-gray-600">
                                {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Toplam: </span>
                              <span className="text-primary-600 font-semibold">₺{order.total.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="font-medium">Ödeme: </span>
                              <span>{order.paymentMethod === 'cash' ? 'Kapıda Nakit' : 'Kredi Kartı'}</span>
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <span className="text-sm text-yellow-800">
                              <strong>Not:</strong> {order.notes}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Detay
                        </Button>

                        {nextStatus && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, nextStatus)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            {statusConfig[nextStatus].label}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
