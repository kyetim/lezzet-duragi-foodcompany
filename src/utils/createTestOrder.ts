import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const createTestOrder = async (): Promise<string> => {
  try {
    console.log('🧪 Creating test order to initialize orders collection...');
    
    const testOrder = {
      // Required fields
      userId: 'test_user_id',
      orderNumber: 'TEST-2024-000001',
      
      // Customer Info
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '+90 555 000 0000',
      
      // Order Items
      items: [{
        id: 'test_item',
        productId: 'test_item',
        name: 'Test Item',
        price: 50,
        quantity: 1,
        category: 'Test',
        image: '/test.jpg'
      }],
      itemsCount: 1,
      
      // Pricing
      subtotal: 50,
      deliveryFee: 15,
      total: 65,
      
      // Delivery Info
      deliveryAddress: {
        id: 'test_address',
        userId: 'test_user_id',
        title: 'Test Address',
        addressType: 'home',
        fullName: 'Test Customer',
        phone: '+90 555 000 0000',
        address: 'Test Address Line',
        district: 'Test District',
        city: 'Test City',
        postalCode: '00000',
        isDefault: true,
        createdAt: serverTimestamp()
      },
      estimatedDeliveryTime: 30,
      
      // Payment Info
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      
      // Order Status
      status: 'confirmed',
      
      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      estimatedReadyAt: serverTimestamp(),
      
      // Test marker
      isTestOrder: true
    };

    const docRef = await addDoc(collection(db, 'orders'), testOrder);
    console.log('✅ Test order created with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating test order:', error);
    throw error;
  }
};
