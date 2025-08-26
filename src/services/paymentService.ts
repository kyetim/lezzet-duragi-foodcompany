import stripePromise from '../lib/stripe';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  id: string;
}

export const paymentService = {
  // Create payment intent - requires backend implementation
  async createPaymentIntent(amount: number): Promise<PaymentIntent> {
    try {
      console.log('🔄 Ödeme niyeti oluşturuluyor:', amount, 'TRY');
      
      // TODO: Replace with your actual backend endpoint
      // For now, using a mock response - in production, implement your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock payment intent - replace with real backend call
      const mockPaymentIntent = {
        clientSecret: `pi_test_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(amount * 100),
        id: `pi_test_${Math.random().toString(36).substr(2, 9)}`
      };
      
      console.log('✅ Ödeme niyeti oluşturuldu:', mockPaymentIntent);
      return mockPaymentIntent;
      
      /* Production implementation:
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
        throw new Error('Ödeme niyeti oluşturulamadı');
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
      console.log('🔄 Ödeme onaylanıyor:', clientSecret);
      
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