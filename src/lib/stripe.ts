import { loadStripe } from '@stripe/stripe-js';

// Check if we should use mock payments or real Stripe
const useMockPayments = import.meta.env.VITE_USE_MOCK_PAYMENTS === 'true';
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Only load Stripe if we have a valid key and not using mock mode
const stripePromise = !useMockPayments && stripeKey && stripeKey !== 'pk_test_your_actual_stripe_publishable_key_here'
  ? loadStripe(stripeKey)
  : null;

console.log('🔧 Stripe Yapılandırması:', {
  useMockPayments,
  hasValidKey: !!(stripeKey && stripeKey !== 'pk_test_your_actual_stripe_publishable_key_here'),
  mode: useMockPayments ? 'Mock Modu' : 'Stripe Modu'
});

export default stripePromise;
export { useMockPayments };
