import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  ArrowLeft,
  Copy,
  Play
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PaymentModal } from '../components/payment/PaymentModal';
import { paymentService, TEST_CARDS } from '../services/paymentService';
import { useToast } from '../hooks/useToast';
import { Link } from 'react-router-dom';

export const PaymentTestPage: React.FC = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [testAmount, setTestAmount] = useState(50.00);
  const [isTestingPayment, setIsTestingPayment] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const toast = useToast();
  const isMockMode = import.meta.env.VITE_USE_MOCK_PAYMENTS === 'true';
  const hasStripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && 
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY !== 'pk_test_51RzJ5JHShmnVi3sJygvKmmA8W7zks40xmiOe64RkLaoEzyPrYphXRSAHLqbSnUGFGTEJKOIMrbaUkjtsU77yVWM500KazG6bIe';

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('✅ Ödeme başarılı:', paymentIntent);
    toast.success('Ödeme Başarılı!', `Ödeme ID: ${paymentIntent.id}`);
    
    setTestResults(prev => [...prev, {
      type: 'success',
      message: 'Ödeme başarıyla tamamlandı',
      paymentId: paymentIntent.id,
      timestamp: new Date().toLocaleTimeString('tr-TR')
    }]);
  };

  const handlePaymentError = (error: string) => {
    console.log('❌ Ödeme başarısız:', error);
    toast.error('Ödeme Hatası', error);
    
    setTestResults(prev => [...prev, {
      type: 'error',
      message: error,
      timestamp: new Date().toLocaleTimeString('tr-TR')
    }]);
  };

  const runPaymentServiceTest = async () => {
    setIsTestingPayment(true);
    setTestResults([]);
    
    try {
      toast.info('Test Başlatıldı', 'Ödeme servisi test senaryoları çalıştırılıyor...');
      
      // Test 1: Create Payment Intent
      console.log('🧪 Test 1: Ödeme niyeti oluşturuluyor...');
      const paymentIntent = await paymentService.createPaymentIntent(testAmount);
      
      setTestResults(prev => [...prev, {
        type: 'info',
        message: `Ödeme niyeti oluşturuldu: ${paymentIntent.id}`,
        timestamp: new Date().toLocaleTimeString('tr-TR')
      }]);

      // Test 2: Mock Payment Confirmation
      console.log('🧪 Test 2: Mock ödeme onayı...');
      const mockPaymentMethod = {
        id: 'pm_test_' + Math.random().toString(36).substr(2, 9),
        type: 'card'
      };
      
      const result = await paymentService.confirmPayment(
        paymentIntent.clientSecret, 
        mockPaymentMethod
      );
      
      setTestResults(prev => [...prev, {
        type: 'success',
        message: `Ödeme onaylandı: ${result.id}`,
        timestamp: new Date().toLocaleTimeString('tr-TR')
      }]);

      toast.success('Test Tamamlandı', 'Tüm ödeme servisi testleri başarılı!');
      
    } catch (error: any) {
      console.error('Test başarısız:', error);
      setTestResults(prev => [...prev, {
        type: 'error',
        message: `Test başarısız: ${error.message}`,
        timestamp: new Date().toLocaleTimeString('tr-TR')
      }]);
      toast.error('Test Başarısız', error.message);
    } finally {
      setIsTestingPayment(false);
    }
  };

  const copyTestCard = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
    toast.success('Kopyalandı', `Test kart numarası kopyalandı: ${cardNumber}`);
  };

  const testCards = [
    { name: 'Visa Success', number: TEST_CARDS.VISA_SUCCESS, result: 'Payment succeeds' },
    { name: 'Visa Declined', number: TEST_CARDS.VISA_DECLINED, result: 'Payment declined' },
    { name: 'Insufficient Funds', number: TEST_CARDS.VISA_INSUFFICIENT_FUNDS, result: 'Insufficient funds' },
    { name: 'Expired Card', number: TEST_CARDS.VISA_EXPIRED_CARD, result: 'Card expired' },
    { name: 'CVC Fail', number: TEST_CARDS.VISA_CVC_FAIL, result: 'CVC check fails' },
    { name: 'Mastercard Success', number: TEST_CARDS.MASTERCARD_SUCCESS, result: 'Payment succeeds' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Stripe Payment Test
              </h1>
              <p className="text-gray-600 mt-1">Test the payment system with Stripe integration</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
            <TestTube className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">
              {isMockMode ? 'Mock Mode' : hasStripeKey ? 'Stripe Mode' : 'Setup Required'}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Test Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            
            {/* Configuration Status */}
            <Card className={`border-2 ${
              isMockMode ? 'border-yellow-300 bg-yellow-50' : 
              hasStripeKey ? 'border-green-300 bg-green-50' : 
              'border-red-300 bg-red-50'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className={`w-5 h-5 mr-2 ${
                    isMockMode ? 'text-yellow-600' : 
                    hasStripeKey ? 'text-green-600' : 
                    'text-red-600'
                  }`} />
                  Payment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isMockMode ? (
                  <div className="space-y-2">
                    <p className="text-yellow-800 font-medium">🔧 Mock Mode Active</p>
                    <p className="text-sm text-yellow-700">
                      Payments are simulated. No real Stripe integration needed for testing.
                    </p>
                    <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>To use real Stripe:</strong><br/>
                        1. Get your test keys from <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" className="underline">Stripe Dashboard</a><br/>
                        2. Update VITE_STRIPE_PUBLISHABLE_KEY in .env.local<br/>
                        3. Set VITE_USE_MOCK_PAYMENTS=false
                      </p>
                    </div>
                  </div>
                ) : hasStripeKey ? (
                  <div className="space-y-2">
                    <p className="text-green-800 font-medium">✅ Stripe Integration Active</p>
                    <p className="text-sm text-green-700">
                      Real Stripe test environment is configured and ready.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-red-800 font-medium">⚠️ Stripe Setup Required</p>
                    <p className="text-sm text-red-700">
                      No valid Stripe key found. Add your test key to .env.local to use real Stripe.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Amount Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Payment Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Amount (TRY)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={testAmount}
                      onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount..."
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setTestAmount(25)}
                      variant="outline"
                      size="sm"
                    >
                      ₺25
                    </Button>
                    <Button 
                      onClick={() => setTestAmount(50)}
                      variant="outline"
                      size="sm"
                    >
                      ₺50
                    </Button>
                    <Button 
                      onClick={() => setTestAmount(100)}
                      variant="outline"
                      size="sm"
                    >
                      ₺100
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="w-5 h-5 mr-2 text-green-600" />
                  Test Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Test Card Payment UI
                </Button>
                
                <Button
                  onClick={runPaymentServiceTest}
                  disabled={isTestingPayment}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  {isTestingPayment ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Running Tests...
                    </div>
                  ) : (
                    <>
                      <TestTube className="w-5 h-5 mr-2" />
                      Test Payment Service
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

          </motion.div>

          {/* Test Cards & Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            
            {/* Stripe Test Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-600" />
                  Stripe Test Cards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testCards.map((card, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{card.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{card.number}</div>
                        <div className="text-xs text-blue-600">{card.result}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyTestCard(card.number)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm text-yellow-800">
                    <strong>Test Details:</strong><br />
                    • Use any future expiry date (e.g., 12/25)<br />
                    • Use any 3-digit CVC (e.g., 123)<br />
                    • Use any postal code (e.g., 12345)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {testResults.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                      Henüz test sonucu yok. Sonuçları görmek için bir test çalıştırın.
                    </p>
                  ) : (
                    testResults.map((result, index) => (
                      <div 
                        key={index}
                        className={`flex items-start space-x-2 p-2 rounded text-sm ${
                          result.type === 'success' ? 'bg-green-50 text-green-800' :
                          result.type === 'error' ? 'bg-red-50 text-red-800' :
                          'bg-blue-50 text-blue-800'
                        }`}
                      >
                        {result.type === 'success' && <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />}
                        {result.type === 'error' && <XCircle className="w-4 h-4 mt-0.5 text-red-600" />}
                        {result.type === 'info' && <Info className="w-4 h-4 mt-0.5 text-blue-600" />}
                        <div className="flex-1">
                          <div>{result.message}</div>
                          <div className="text-xs opacity-75">{result.timestamp}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

          </motion.div>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={testAmount}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />

      </div>
    </div>
  );
};