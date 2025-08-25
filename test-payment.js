// Quick test script for payment service
import { paymentService } from '../src/services/paymentService.js';

async function testPaymentService() {
  console.log('🧪 Starting Payment Service Test...\n');

  try {
    // Test 1: Create Payment Intent
    console.log('📝 Test 1: Creating payment intent...');
    const paymentIntent = await paymentService.createPaymentIntent(50.00);
    console.log('✅ Payment intent created:', paymentIntent);
    console.log('');

    // Test 2: Mock Payment Confirmation
    console.log('🔄 Test 2: Confirming payment...');
    const mockPaymentMethod = {
      id: 'pm_test_mock_card',
      type: 'card'
    };
    
    const result = await paymentService.confirmPayment(
      paymentIntent.clientSecret, 
      mockPaymentMethod
    );
    
    console.log('✅ Payment confirmed:', result);
    console.log('');
    
    console.log('🎉 All tests passed! Payment service is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPaymentService();