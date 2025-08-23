import stripePromise from '../lib/stripe';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
}

export const paymentService = {
  // Ödeme niyeti oluştur
  async createPaymentIntent(amount: number): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Stripe kuruş cinsinden çalışır
          currency: 'try'
        }),
      });

      if (!response.ok) {
        throw new Error('Ödeme niyeti oluşturulamadı');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment intent error:', error);
      throw error;
    }
  },

  // Ödeme onayla
  async confirmPayment(clientSecret: string, paymentMethod: any) {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe yüklenemedi');

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.paymentIntent;
    } catch (error) {
      console.error('Payment confirmation error:', error);
      throw error;
    }
  }
};
