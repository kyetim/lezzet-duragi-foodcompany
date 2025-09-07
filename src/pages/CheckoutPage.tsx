import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/useToast';
import { useLoading } from '../hooks/useLoading';
import { useCheckoutSteps } from '../hooks/useCheckoutSteps';
import { userAddressService } from '../services/userService';
import { orderService } from '../services/orderService';
import { orderFirebaseService, type CreateOrderInput } from '../services/orderFirebaseService';
import { Button } from '../components/ui/button';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { CheckoutProgressIndicator } from '../components/checkout/CheckoutProgressIndicator';
import { AddressStep } from '../components/checkout/steps/AddressStep';
import { PaymentStep } from '../components/checkout/steps/PaymentStep';
import { ReviewStep } from '../components/checkout/steps/ReviewStep';
import { PaymentModal } from '../components/payment/PaymentModal';
import { PaymentSuccessModal } from '../components/ui/PaymentSuccessModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import type { Order, OrderStatus } from '../interfaces/order';
import type { UserAddress } from '../interfaces/user';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { state: cartState, clearCart } = useCart();
  const toast = useToast();
  const { isLoading, withLoading } = useLoading();

  // Checkout Steps
  const {
    currentStep,
    currentStepId,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    canProceedToNext,
    setCanProceedToNext
  } = useCheckoutSteps();

  // State
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [notes, setNotes] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Kullanıcı ve sepet durumu kontrolü (sadece ilk yüklemede)
  useEffect(() => {
    console.log('🔍 CheckoutPage initial check:', {
      currentUser: !!currentUser,
      cartItemsCount: cartState.items.length
    });

    if (!currentUser) {
      console.log('🔴 No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    if (cartState.items.length === 0) {
      console.log('🔴 Cart is empty, redirecting to menu');
      navigate('/menu');
      return;
    }
  }, [currentUser, navigate]); // cartState.items.length KALDIRILDI!

  // Adres yükleme (sadece user değiştiğinde)
  useEffect(() => {
    if (!currentUser) return;

    console.log('🔄 Fetching addresses for user:', currentUser.uid);

    const fetchAddresses = async () => {
      try {
        // Mock address data for testing
        const mockAddresses = [
          {
            id: 'mock-1',
            title: 'Ev Adresi',
            fullName: currentUser.displayName || 'Test Kullanıcı',
            phone: '+90 555 123 4567',
            address: 'Atatürk Mahallesi, Cumhuriyet Caddesi No: 123/5',
            district: 'Akdeniz',
            city: 'Mersin',
            postalCode: '33100',
            isDefault: true,
            createdAt: new Date(),
            fullAddress: 'Atatürk Mahallesi, Cumhuriyet Caddesi No: 123/5, Akdeniz, Mersin'
          },
          {
            id: 'mock-2',
            title: 'İş Yeri',
            fullName: currentUser.displayName || 'Test Kullanıcı',
            phone: '+90 555 987 6543',
            address: 'Çankaya Mahallesi, İstiklal Caddesi No: 45/2',
            district: 'Yenişehir',
            city: 'Mersin',
            postalCode: '33200',
            isDefault: false,
            createdAt: new Date(),
            fullAddress: 'Çankaya Mahallesi, İstiklal Caddesi No: 45/2, Yenişehir, Mersin'
          }
        ];

        // Try to get real addresses with timeout, fallback to mock
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 3000)
          );

          const addressPromise = userAddressService.getUserAddresses(currentUser.uid);
          const realAddresses = await Promise.race([addressPromise, timeoutPromise]) as any;

          if (realAddresses.length > 0) {
            setAddresses(realAddresses);
            setSelectedAddress(realAddresses[0]);
            console.log('🟢 Real addresses loaded:', realAddresses.length);
          } else {
            setAddresses(mockAddresses);
            setSelectedAddress(mockAddresses[0]);
            console.log('🔧 Using mock addresses (no real addresses found)');
          }
        } catch (firebaseError) {
          console.warn('Firebase address fetch failed, using mock data:', firebaseError);
          setAddresses(mockAddresses);
          setSelectedAddress(mockAddresses[0]);
        }

        console.log('🟢 Addresses setup completed');
      } catch (error) {
        console.error('Error in fetchAddresses:', error);
        // Son çare: Boş adres bile olsa devam et
        setAddresses([]);
        toast.error('Uyarı', 'Adresler yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      }
    };

    fetchAddresses();
  }, [currentUser]); // Sadece currentUser dependency!

  // Calculate totals
  const calculateSubtotal = () => cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calculateDeliveryFee = () => calculateSubtotal() > 50 ? 0 : 10;
  const calculateTax = () => calculateSubtotal() * 0.08; // 8% tax
  const calculateTotal = () => calculateSubtotal() + calculateDeliveryFee() + calculateTax();

  // Order processing with Firebase
  const processOrder = withLoading(async (paymentIntentId?: string) => {
    try {
      setIsPlacingOrder(true);

      // Prepare Firebase order data (filter undefined values)
      const firebaseOrderData: CreateOrderInput = {
        userId: currentUser!.uid,
        customerName: currentUser!.displayName || 'Müşteri',
        customerEmail: currentUser!.email || '',
        customerPhone: selectedAddress!.phone,
        items: cartState.items,
        deliveryAddress: selectedAddress!,
        paymentMethod: paymentMethod,
        estimatedDeliveryTime: 30 // minutes
      };

      // Add optional fields only if they have values
      if (paymentIntentId) {
        firebaseOrderData.paymentIntentId = paymentIntentId;
      }
      
      if (notes && notes.trim()) {
        firebaseOrderData.notes = notes.trim();
      }

      console.log('🔍 Debug Auth State:', {
        currentUser: currentUser?.uid,
        email: currentUser?.email,
        isAuthenticated: !!currentUser
      });
      console.log('🔄 Creating Firebase order...', firebaseOrderData);

      // Create order in Firebase
      const orderId = await orderFirebaseService.createOrder(firebaseOrderData);

      clearCart();
      setCompletedOrderId(orderId);
      setShowSuccessModal(true);

      toast.success(
        'Sipariş Tamamlandı! 🎉',
        `Sipariş numarası: #${orderId.slice(-8).toUpperCase()}`
      );

      console.log('✅ Sipariş başarıyla oluşturuldu:', orderId);
    } catch (error) {
      console.error('❌ Error placing order:', error);
      toast.error('Sipariş Hatası', 'Sipariş verilirken bir hata oluştu. Lütfen tekrar deneyin.');
      throw error;
    } finally {
      setIsPlacingOrder(false);
    }
  }, 'order');

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card') {
      setShowPaymentModal(true);
    } else {
      await processOrder();
    }
  };

  const handlePaymentSuccess = async (paymentIntentId?: string) => {
    setShowPaymentModal(false);
    await processOrder(paymentIntentId);
  };

  const handleNextStep = () => {
    if (canProceedToNext) {
      nextStep();
    }
  };

  const handleAddNewAddress = () => {
    // TODO: Open address form modal
    toast.info('Özellik Geliştiriliyor', 'Yeni adres ekleme özelliği yakında gelecek!');
  };

  if (isLoading()) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Siparişi Tamamla</h1>
            <p className="text-gray-600 mt-1">Adım adım kolay sipariş</p>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <CheckoutProgressIndicator currentStep={currentStep} />

        {/* Step Content */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {currentStepId === 'address' && (
              <AddressStep
                key="address"
                addresses={addresses}
                selectedAddress={selectedAddress}
                onAddressSelect={setSelectedAddress}
                onAddNewAddress={handleAddNewAddress}
                onCanProceed={setCanProceedToNext}
              />
            )}

            {currentStepId === 'payment' && (
              <PaymentStep
                key="payment"
                paymentMethod={paymentMethod}
                onPaymentMethodSelect={setPaymentMethod}
                onCanProceed={setCanProceedToNext}
              />
            )}

            {currentStepId === 'review' && (
              <ReviewStep
                key="review"
                cartItems={cartState.items}
                selectedAddress={selectedAddress}
                paymentMethod={paymentMethod}
                notes={notes}
                onNotesChange={setNotes}
                onCanProceed={setCanProceedToNext}
                onEditAddress={() => goToStep(0)}
                onEditPayment={() => goToStep(1)}
                isPlacingOrder={isPlacingOrder}
                onOpenPaymentModal={() => setShowPaymentModal(true)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border"
        >
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className={`flex items-center gap-2 ${isFirstStep ? 'opacity-50' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Button>

          <div className="flex items-center gap-4">
            {/* Order Total (visible on all steps) */}
            <div className="text-right">
              <p className="text-sm text-gray-500">Toplam Tutar</p>
              <p className="text-xl font-bold text-primary-600">₺{calculateTotal().toFixed(2)}</p>
            </div>

            {isLastStep ? (
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={!canProceedToNext || isPlacingOrder}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
                  size="lg"
                >
                  {isPlacingOrder ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      İşleniyor...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Siparişi Onayla
                    </div>
                  )}
                </Button>
              </motion.div>
            ) : (
              <Button
                onClick={handleNextStep}
                disabled={!canProceedToNext}
                className={`flex items-center gap-2 px-6 ${!canProceedToNext ? 'opacity-50' : ''}`}
              >
                Devam Et
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={calculateTotal()}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={(error) => {
          setShowPaymentModal(false);
          toast.error('Ödeme Hatası', error);
        }}
      />

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/orders');
        }}
        orderNumber={completedOrderId ? `#${completedOrderId.slice(-8).toUpperCase()}` : ''}
        totalAmount={calculateTotal()}
        paymentMethod={paymentMethod === 'card' ? 'Kredi Kartı' : 'Kapıda Nakit'}
        estimatedDeliveryTime={new Date(Date.now() + 30 * 60 * 1000)} // 30 dakika sonra
        deliveryAddress={selectedAddress ? {
          fullName: selectedAddress.fullName,
          address: selectedAddress.address,
          district: selectedAddress.district,
          city: selectedAddress.city
        } : undefined}
      />
    </div>
  );
};