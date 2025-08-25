import stripePromise, { useMockPayments } from '../lib/stripe';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  id: string;
}

// Mock backend response for testing
const createMockPaymentIntent = (amount: number): PaymentIntent => {
  // Simulate a Stripe payment intent response
  const mockClientSecret = `pi_test_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    clientSecret: mockClientSecret,
    amount: Math.round(amount * 100), // Stripe uses cents
    id: `pi_test_${Math.random().toString(36).substr(2, 9)}`
  };
};

export const paymentService = {
  // Create payment intent - using mock for testing
  async createPaymentIntent(amount: number): Promise<PaymentIntent> {
    try {
      // For demo purposes, we'll use a mock payment intent
      // In production, this would call your backend API
      console.log('🔄 Miktar için ödeme niyeti oluşturuluyor:', amount, 'TRY');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const paymentIntent = createMockPaymentIntent(amount);
      
      console.log('✅ Ödeme niyeti oluşturuldu:', paymentIntent);
      return paymentIntent;
      
      /* Real implementation would be:
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Stripe works with cents
          currency: 'try'
        }),
      });

      if (!response.ok) {
        throw new Error('Payment intent could not be created');
      }

      const data = await response.json();
      return data;
      */
    } catch (error) {
      console.error('❌ Ödeme niyeti hatası:', error);
      throw error;
    }
  },

  // Confirm payment using Stripe.js
  async confirmPayment(clientSecret: string, paymentMethod: any) {
    try {
      console.log('🔄 Ödeme client secret ile onaylanıyor:', clientSecret);
      
      // If using mock payments, return mock success
      if (useMockPayments) {
        console.log('🔧 Mock ödeme modu kullanılıyor - başarılı ödeme simüle ediliyor');
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockResult = {
          id: clientSecret.split('_secret_')[0] || `pi_mock_${Math.random().toString(36).substr(2, 9)}`,
          status: 'succeeded',
          amount: Math.round(Math.random() * 10000),
          currency: 'try',
          created: Math.floor(Date.now() / 1000),
          payment_method: paymentMethod.id || `pm_mock_${Math.random().toString(36).substr(2, 9)}`
        };

        console.log('✅ Mock ödeme başarıyla onaylandı:', mockResult);
        return mockResult;
      }
      
      // Real Stripe implementation
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe could not be loaded. Please check your Stripe configuration.');
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      console.log('✅ Gerçek Stripe ödemesi başarıyla onaylandı:', result.paymentIntent);
      return result.paymentIntent;
    } catch (error) {
      console.error('❌ Ödeme onay hatası:', error);
      throw error;
    }
  },

  // Test card payment with actual Stripe (for real testing)
  async testCardPayment(amount: number, testCardInfo: any): Promise<any> {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe could not be loaded');

      console.log('🧪 Testing card payment with test card...');

      // Create a payment method with test card
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: testCardInfo,
        billing_details: {
          name: 'Test Customer',
          email: 'test@example.com',
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Create payment intent and confirm
      const paymentIntent = await this.createPaymentIntent(amount);
      const result = await this.confirmPayment(paymentIntent.clientSecret, paymentMethod);

      return result;
    } catch (error) {
      console.error('❌ Test kart ödeme hatası:', error);
      throw error;
    }
  }
};

// Test card numbers for Stripe testing
export const TEST_CARDS = {
  VISA_SUCCESS: '4242424242424242',
  VISA_DECLINED: '4000000000000002',
  VISA_INSUFFICIENT_FUNDS: '4000000000009995',
  VISA_EXPIRED_CARD: '4000000000000069',
  VISA_CVC_FAIL: '4000000000000127',
  MASTERCARD_SUCCESS: '5555555555554444',
  MASTERCARD_DECLINED: '5200000000000007'
};

export default paymentService;