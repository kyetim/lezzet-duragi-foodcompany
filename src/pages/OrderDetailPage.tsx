import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Phone, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  ShoppingCart
} from 'lucide-react';
import type { Order, OrderStatus } from '../interfaces/order';

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'preparing':
      return 'bg-orange-100 text-orange-800';
    case 'ready':
      return 'bg-green-100 text-green-800';
    case 'delivered':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'confirmed':
      return <CheckCircle className="w-4 h-4" />;
    case 'preparing':
      return <AlertCircle className="w-4 h-4" />;
    case 'ready':
      return <Truck className="w-4 h-4" />;
    case 'delivered':
      return <CheckCircle className="w-4 h-4" />;
    case 'cancelled':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'Beklemede';
    case 'confirmed':
      return 'Onaylandı';
    case 'preparing':
      return 'Hazırlanıyor';
    case 'ready':
      return 'Hazır';
    case 'delivered':
      return 'Teslim Edildi';
    case 'cancelled':
      return 'İptal Edildi';
    default:
      return 'Bilinmiyor';
  }
};

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { currentUser, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !currentUser) return;

      try {
        setLoadingOrder(true);
        const orderData = await orderService.getOrderById(orderId);
        
        if (!orderData) {
          setError('Sipariş bulunamadı');
          return;
        }

        // Sadece kendi siparişini görebilir
        if (orderData.userId !== currentUser.uid) {
          setError('Bu siparişe erişim izniniz yok');
          return;
        }

        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Sipariş yüklenirken hata oluştu');
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId, currentUser]);

  const handleReorder = () => {
    // TODO: Sepete ekleme işlemi
    console.log('Reorder:', order);
    // Burada sepet context'ine ürünleri ekleyeceğiz
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = () => {
    if (!order) return 0;
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading || loadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Hata</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/orders">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Siparişlerime Dön
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sipariş Bulunamadı</h1>
            <p className="text-gray-600 mb-6">Aradığınız sipariş mevcut değil.</p>
            <Link to="/orders">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Siparişlerime Dön
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sipariş #{order.id}</h1>
              <p className="text-gray-600">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleReorder} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Yeniden Sipariş Ver
            </Button>
            <Button onClick={handleReorder}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Sepete Ekle
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getStatusIcon(order.status)}
                  <span className="ml-2">Sipariş Durumu</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </Badge>
                  {order.estimatedDeliveryTime && (
                    <div className="text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Tahmini Teslimat: {formatDate(order.estimatedDeliveryTime)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Edilen Ürünler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <span className="text-gray-500 text-xs">Resim</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₺{item.price.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Adet: {item.quantity}</div>
                        <div className="text-sm font-medium text-primary-600">
                          ₺{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Sipariş Notları</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span>₺{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Teslimat Ücreti:</span>
                    <span>₺{order.deliveryFee?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>KDV:</span>
                    <span>₺{order.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Toplam:</span>
                    <span>₺{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Teslimat Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{order.deliveryAddress?.title}</p>
                      <p className="text-sm text-gray-600">{order.deliveryAddress?.fullAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{order.deliveryAddress?.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{order.paymentMethod}</span>
                </div>
                {order.paymentStatus && (
                  <div className="mt-2">
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {order.paymentStatus === 'paid' ? 'Ödendi' : 'Beklemede'}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
