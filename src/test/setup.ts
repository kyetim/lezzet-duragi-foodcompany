import '@testing-library/jest-dom';

// Mock environment variables for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_mock_key_for_testing',
    VITE_USE_MOCK_PAYMENTS: 'true',
    DEV: true,
  },
  writable: true,
});

// Mock Stripe
vi.mock('../lib/stripe', () => ({
  default: Promise.resolve({
    confirmCardPayment: vi.fn(),
    createPaymentMethod: vi.fn(),
    elements: vi.fn(),
    paymentMethods: vi.fn(),
  }),
}));

// Global test utilities
global.console = {
  ...console,
  // Suppress console.log/warn/error in tests unless needed
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};