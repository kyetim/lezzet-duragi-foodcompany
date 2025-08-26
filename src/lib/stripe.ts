import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  console.warn('⚠️ VITE_STRIPE_PUBLISHABLE_KEY bulunamadı. Lütfen .env.local dosyasında Stripe anahtarınızı yapılandırın.');
}

// Load Stripe with the publishable key
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

console.log('🔧 Stripe Yapılandırması:', {
  hasValidKey: !!stripeKey,
  keyPreview: stripeKey ? `${stripeKey.substring(0, 12)}...` : 'Yok',
  mode: 'Gerçek Stripe Modu'
});

export default stripePromise;
