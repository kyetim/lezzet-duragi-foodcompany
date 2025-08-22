import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { userAddressService } from '../services/userService';
import { orderService } from '../services/orderService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  CreditCard, 
  Truck, 
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import type { UserAddress } from '../interfaces/user';
import type { Order, OrderStatus } from '../interfaces/order';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { state: cartState, clearCart } = useCart();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    if (cartState.items.length === 0) {
      navigate('/menu');
      return;
    }

    const fetchAddresses = async () => {
      try {
        const userAddresses = await userAddressService.getUserAddresses(currentUser.uid);
        setAddresses(userAddresses);
        if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0]);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [currentUser, navigate, cartState.items.length]);

  const handleAddNewAddress = () => {
    navigate('/profile?tab=addresses');
  };

  const calculateSubtotal = () => {
    return cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 15; // 100 TL üzeri ücretsiz teslimat
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // %8 KDV
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee() + calculateTax();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !currentUser) {
      alert('Lütfen teslimat adresi seçin');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus'> = {
        userId: currentUser.uid,
        items: cartState.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          description: item.description
        })),
        subtotal: calculateSubtotal(),
        deliveryFee: calculateDeliveryFee(),
        tax: calculateTax(),
        totalAmount: calculateTotal(),
        deliveryAddress: selectedAddress,
        paymentMethod: paymentMethod === 'cash' ? 'Nakit' : 'Kredi Kartı',
        notes: notes.trim() || undefined,
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60000) // 45 dakika sonra
      };

      const orderId = await orderService.createOrder(orderData);
      
      // Sepeti temizle
      clearCart();
      
      // Başarı sayfasına yönlendir
      navigate(`/orders/${orderId}?success=true`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Sipariş verilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Siparişi Tamamla</h1>
              <p className="text-gray-600">Siparişinizi tamamlamak için bilgilerinizi kontrol edin</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Teslimat Adresi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Adres Bulunamadı</h3>
                    <p className="text-gray-600 mb-4">Sipariş verebilmek için en az bir adres eklemeniz gerekiyor.</p>
                    <Button onClick={handleAddNewAddress}>
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Adres Ekle
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddress?.id === address.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{address.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{address.fullAddress}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Phone className="w-4 h-4 mr-1" />
                              {address.phone}
                            </div>
                          </div>
                          {selectedAddress?.id === address.id && (
                            <CheckCircle className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={handleAddNewAddress} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Adres Ekle
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Ödeme Yöntemi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Nakit</h3>
                        <p className="text-sm text-gray-600">Teslimat sırasında nakit ödeme</p>
                      </div>
                      {paymentMethod === 'cash' && (
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Kredi Kartı</h3>
                        <p className="text-sm text-gray-600">Güvenli online ödeme</p>
                      </div>
                      {paymentMethod === 'card' && (
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Notları</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Siparişinizle ilgili özel notlarınızı buraya yazabilirsiniz..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.image && item.image.trim() !== '' ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">🍽️</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500">Adet: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold">₺{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <hr />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ara Toplam:</span>
                      <span>₺{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Teslimat Ücreti:</span>
                      <span className={calculateDeliveryFee() === 0 ? 'text-green-600' : ''}>
                        {calculateDeliveryFee() === 0 ? 'Ücretsiz' : `₺${calculateDeliveryFee().toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>KDV (%8):</span>
                      <span>₺{calculateTax().toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Toplam:</span>
                      <span>₺{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-blue-800">
                      <Truck className="w-4 h-4 mr-2" />
                      <span>Tahmini teslimat süresi: 30-45 dakika</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              className="w-full btn-primary text-lg py-3 rounded-xl shadow-xl"
              onClick={handlePlaceOrder}
              disabled={isProcessing || !selectedAddress || cartState.items.length === 0}
            >
              {isProcessing ? 'Sipariş Veriliyor...' : 'Siparişi Tamamla'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
