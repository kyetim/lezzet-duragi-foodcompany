import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/useToast';
import { useLoading } from '../hooks/useLoading';
import { userAddressService } from '../services/userService';
import { orderService } from '../services/orderService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { PageLoading, ButtonLoading } from '../components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  CreditCard, 
  Truck, 
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
  Shield,
  Star,
  Package,
  CreditCard as CreditCardIcon,
  Banknote
} from 'lucide-react';
import type { Order, OrderStatus } from '../interfaces/order';
import type { UserAddress } from '../interfaces/user';
import { PaymentModal } from '../components/payment/PaymentModal';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { state: cartState, clearCart } = useCart();
  const toast = useToast();
  const { isLoading, setLoading, withLoading } = useLoading();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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
        setLoading(true, 'page');
        const userAddresses = await userAddressService.getUserAddresses(currentUser.uid);
        // fullAddress alanını oluşturarak tip uyumluluğunu sağla
        const compatibleAddresses = userAddresses.map(addr => ({
          ...addr,
          fullAddress: `${addr.address}, ${addr.district}, ${addr.city}`
        }));
        setAddresses(compatibleAddresses);
        if (compatibleAddresses.length > 0) {
          setSelectedAddress(compatibleAddresses[0]);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Adres Yükleme Hatası', 'Adresleriniz yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false, 'page');
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
    return subtotal > 100 ? 0 : 15;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee() + calculateTax();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !currentUser) {
      toast.warning('Eksik Bilgi', 'Lütfen teslimat adresi seçin');
      return;
    }

    if (paymentMethod === 'card') {
      setShowPaymentModal(true);
      return;
    }

    await processOrder();
  };

  const processOrder = withLoading(async () => {
    try {
      const cleanOrderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: currentUser!.uid,
        items: cartState.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || null,
          description: item.description || null
        })),
        subtotal: calculateSubtotal(),
        deliveryFee: calculateDeliveryFee(),
        tax: calculateTax(),
        totalAmount: calculateTotal(),
        deliveryAddress: {
          ...selectedAddress!,
          fullAddress: selectedAddress!.fullAddress || `${selectedAddress!.address}, ${selectedAddress!.district}, ${selectedAddress!.city}`
        },
        paymentMethod: paymentMethod === 'cash' ? 'Nakit' : 'Kredi Kartı',
        notes: notes.trim() || null,
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60000),
        // Eksik alanları ekliyoruz
        status: 'pending' as OrderStatus,
        paymentStatus: 'pending' as const
      };

      // undefined değerlerini filtrele
      const orderData = Object.fromEntries(
        Object.entries(cleanOrderData).filter(([_, value]) => value !== undefined)
      ) as Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;

      const orderId = await orderService.createOrder(orderData);
      clearCart();
      toast.success('Sipariş Alındı', 'Siparişiniz başarıyla oluşturuldu!');
      navigate(`/orders/${orderId}?success=true`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Sipariş Hatası', 'Sipariş verilirken bir hata oluştu. Lütfen tekrar deneyin.');
      throw error;
    }
  }, 'order');

  const handlePaymentSuccess = async (paymentIntent: any) => {
    await processOrder();
  };

  const handlePaymentError = (error: string) => {
    toast.error('Ödeme Hatası', error);
  };

  if (isLoading('page')) {
    return <PageLoading text="Sipariş bilgileriniz hazırlanıyor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-white/80 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Siparişi Tamamla
              </h1>
              <p className="text-gray-600 mt-1">Lezzetli yemekleriniz yolda! 🚀</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Adres</span>
            </div>
            <div className="w-8 h-1 bg-gray-300 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Ödeme</span>
            </div>
            <div className="w-8 h-1 bg-gray-300 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Onay</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    Teslimat Adresi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Adres Bulunamadı</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Sipariş verebilmek için en az bir adres eklemeniz gerekiyor.
                      </p>
                      <Button 
                        onClick={handleAddNewAddress}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl shadow-lg"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Adres Ekle
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {addresses.map((address, index) => (
                          <motion.div
                            key={address.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                              selectedAddress?.id === address.id
                                ? 'border-orange-500 bg-orange-50 shadow-lg'
                                : 'border-gray-200 hover:border-orange-300 bg-white'
                            }`}
                            onClick={() => setSelectedAddress(address)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <h3 className="font-semibold text-gray-900 text-lg">{address.title}</h3>
                                  {selectedAddress?.id === address.id && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="ml-3"
                                    >
                                      <CheckCircle className="w-5 h-5 text-orange-500" />
                                    </motion.div>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-3 leading-relaxed">
                                  {address.address}, {address.district}, {address.city}
                                </p>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Phone className="w-4 h-4 mr-2" />
                                  {address.phone}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: addresses.length * 0.1 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={handleAddNewAddress} 
                          className="w-full py-4 border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 rounded-2xl"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Yeni Adres Ekle
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    Ödeme Yöntemi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                        paymentMethod === 'cash'
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                            <Banknote className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">Nakit</h3>
                            <p className="text-sm text-gray-600">Teslimat sırasında ödeme</p>
                          </div>
                        </div>
                        {paymentMethod === 'cash' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <CheckCircle className="w-6 h-6 text-blue-500" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                            <CreditCardIcon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">Kredi Kartı</h3>
                            <p className="text-sm text-gray-600">Güvenli online ödeme</p>
                          </div>
                        </div>
                        {paymentMethod === 'card' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <CheckCircle className="w-6 h-6 text-blue-500" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Notes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    Sipariş Notları
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Siparişinizle ilgili özel notlarınızı buraya yazabilirsiniz... (Örn: Acil teslimat, kapı zili çalışmıyor, vb.)"
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                    rows={4}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm sticky top-8">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    Sipariş Özeti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Order Items */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Ürünler</h4>
                      {cartState.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              {item.image && item.image.trim() !== '' ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <span className="text-gray-400 text-lg">🍽️</span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                              <p className="text-xs text-gray-500">Adet: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-gray-900">₺{(item.price * item.quantity).toFixed(2)}</span>
                        </motion.div>
                      ))}
                    </div>

                    <hr className="border-gray-200" />

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ara Toplam:</span>
                        <span className="font-medium">₺{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Teslimat Ücreti:</span>
                        <span className={`font-medium ${calculateDeliveryFee() === 0 ? 'text-green-600' : ''}`}>
                          {calculateDeliveryFee() === 0 ? 'Ücretsiz' : `₺${calculateDeliveryFee().toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">KDV (%8):</span>
                        <span className="font-medium">₺{calculateTax().toFixed(2)}</span>
                      </div>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Toplam:</span>
                        <span className="text-orange-600">₺{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200"
                    >
                      <div className="flex items-center text-sm text-blue-800 mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="font-semibold">Teslimat Süresi</span>
                      </div>
                      <p className="text-sm text-blue-700">Tahmini teslimat: 30-45 dakika</p>
                    </motion.div>

                    {/* Security Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200"
                    >
                      <div className="flex items-center text-sm text-green-800 mb-2">
                        <Shield className="w-4 h-4 mr-2" />
                        <span className="font-semibold">Güvenli Ödeme</span>
                      </div>
                      <p className="text-sm text-green-700">SSL şifreleme ile güvenli işlem</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Place Order Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={handlePlaceOrder}
                disabled={isLoading('order') || !selectedAddress || cartState.items.length === 0}
              >
                {isLoading('order') ? (
                  <ButtonLoading text="Sipariş Veriliyor..." />
                ) : (
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Siparişi Tamamla
                  </div>
                )}
              </Button>
                         </motion.div>
           </div>
         </div>
       </div>

       {/* Payment Modal */}
       <PaymentModal
         isOpen={showPaymentModal}
         onClose={() => setShowPaymentModal(false)}
         amount={calculateTotal()}
         onPaymentSuccess={handlePaymentSuccess}
         onPaymentError={handlePaymentError}
       />
     </div>
   );
 };
