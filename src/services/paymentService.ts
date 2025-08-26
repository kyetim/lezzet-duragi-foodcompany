import stripePromise from '../lib/stripe';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  id: string;
}

export const paymentService = {
  // Create payment intent - requires backend implementation
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/create-payment-intent`, {
>>>>>>> ebe05264ba901deb1e052f52fb8932ab58d32bcc
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
  async createPaymentIntent(amount: number): Promise<PaymentIntent> {
    try {
      console.log('🔄 Ödeme niyeti oluşturuluyor:', amount, 'TRY');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/create-payment-intent`, {
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
      console.log('✅ Ödeme niyeti oluşturuldu:', data);
      return data;
=======
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/create-payment-intent`, {
>>>>>>> ebe05264ba901deb1e052f52fb8932ab58d32bcc
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