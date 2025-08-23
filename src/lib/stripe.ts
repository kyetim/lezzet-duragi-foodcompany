import { loadStripe } from '@stripe/stripe-js';

// Stripe public key - test key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

export default stripePromise;
