import stripePromise from '../lib/stripe';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  id: string;
}

export const paymentService = {
  // Create payment intent using Vercel serverless function
  async createPaymentIntent(amount: number): Promise<PaymentIntent> {
    try {
      console.log('🔄 Ödeme niyeti oluşturuluyor:', amount, 'TRY');

      // Mock payment kullan: Development modunda VEYA Stripe key yoksa
      const shouldUseMock = import.meta.env.DEV || !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

      if (shouldUseMock) {
        console.log('🔧 Using mock payment intent (DEV mode or no Stripe key)');

        // Mock payment intent for testing
        const mockPaymentIntent = {
          clientSecret: `pi_test_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
          amount: Math.round(amount * 100),
          id: `pi_test_${Math.random().toString(36).substr(2, 9)}`
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('✅ Mock ödeme niyeti oluşturuldu:', mockPaymentIntent);
        return mockPaymentIntent;
      }

      // Production mode: Real Stripe API
      const baseUrl = window.location.origin;

      const response = await fetch(`${baseUrl}/api/create-payment-intent`, {
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ödeme niyeti oluşturulamadı');
      }

      const data = await response.json();
      console.log('✅ Ödeme niyeti oluşturuldu:', data);
      return data;
    } catch (error) {
      console.error('❌ Ödeme niyeti hatası:', error);
      throw error;
    }
  },

  // Confirm payment using Stripe.js
  async confirmPayment(clientSecret: string, paymentMethod: any) {
    try {
      console.log('🔄 Ödeme onaylanıyor:', clientSecret);

      // Mock payment kullan: Development modunda VEYA test client secret varsa
      const shouldUseMock = import.meta.env.DEV || clientSecret.includes('pi_test_');

      if (shouldUseMock) {
        console.log('🔧 Using mock payment confirmation');

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock successful payment intent
        const mockSuccessPayment = {
          id: clientSecret.split('_secret_')[0],
          status: 'succeeded',
          amount: Math.round((paymentMethod.amount || 100) * 100),
          currency: 'try',
          created: Math.floor(Date.now() / 1000),
          client_secret: clientSecret
        };

        console.log('✅ Mock ödeme başarıyla onaylandı:', mockSuccessPayment);
        return mockSuccessPayment;
      }

      // Production mode: Real Stripe confirmation
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe yüklenemedi. Lütfen yapılandırmanızı kontrol edin.');
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Ödeme hatası oluştu');
      }

      console.log('✅ Ödeme başarıyla onaylandı:', result.paymentIntent);
      return result.paymentIntent;
    } catch (error) {
      console.error('❌ Ödeme onay hatası:', error);
      throw error;
    }
  }
};

export default paymentService;