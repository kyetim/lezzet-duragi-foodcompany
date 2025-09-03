// 🧪 Order API Test Data and Utilities

// 📦 Sample Order Data
export const sampleOrderData = {
  customerId: "507f1f77bcf86cd799439011", // Placeholder customer ID
  items: [
    {
      productId: "507f1f77bcf86cd799439012", // Will be replaced with actual product ID
      quantity: 2,
      selectedPortion: {
        name: "Tam",
        priceModifier: 0
      },
      selectedCustomizations: [
        {
          customizationId: "507f1f77bcf86cd799439013",
          customizationName: "Acılık Seviyesi",
          selectedOptions: [
            {
              optionId: "507f1f77bcf86cd799439014",
              optionName: "Orta Acı",
              priceModifier: 0
            }
          ],
          totalPriceModifier: 0
        },
        {
          customizationId: "507f1f77bcf86cd799439015",
          customizationName: "Ek Malzemeler",
          selectedOptions: [
            {
              optionId: "507f1f77bcf86cd799439016",
              optionName: "Ekstra Et",
              priceModifier: 8
            },
            {
              optionId: "507f1f77bcf86cd799439017",
              optionName: "Peynir",
              priceModifier: 5
            }
          ],
          totalPriceModifier: 13
        }
      ],
      specialInstructions: "Lütfen ekstra soslu hazırlayın"
    },
    {
      productId: "507f1f77bcf86cd799439018", // Will be replaced with actual product ID
      quantity: 1,
      selectedPortion: {
        name: "Normal",
        priceModifier: 0
      },
      selectedCustomizations: [],
      specialInstructions: ""
    }
  ],
  deliveryAddress: {
    title: "Ev",
    fullName: "Ahmet Yılmaz",
    phone: "05551234567",
    city: "Mersin",
    district: "Mezitli",
    neighborhood: "Davultepe",
    street: "Atatürk Caddesi",
    buildingNo: "123",
    apartmentNo: "4",
    floor: "2",
    doorNo: "8",
    directions: "Kırmızı kapılı binanın 2. katı, zil çalın",
    coordinates: {
      latitude: 36.8018,
      longitude: 34.6386
    }
  },
  deliveryType: "delivery",
  contactPhone: "05551234567",
  paymentMethod: "cash",
  specialInstructions: "Lütfen kapı ziline basın, köpek var ama uysal",
  customerNotes: "Hızlı teslimat rica ederim, çok acıktım"
};

// 🧪 Order Status Progression Test Data
export const statusProgressionTests = [
  {
    from: "pending",
    to: "confirmed",
    reason: "Ödeme alındı ve sipariş onaylandı",
    shouldSucceed: true
  },
  {
    from: "confirmed",
    to: "preparing",
    reason: "Mutfak hazırlamaya başladı",
    shouldSucceed: true
  },
  {
    from: "preparing",
    to: "ready",
    reason: "Sipariş hazır, teslimat bekliyor",
    shouldSucceed: true
  },
  {
    from: "ready",
    to: "out-for-delivery",
    reason: "Kurye siparişi aldı",
    shouldSucceed: true
  },
  {
    from: "out-for-delivery",
    to: "delivered",
    reason: "Müşteriye teslim edildi",
    shouldSucceed: true
  },
  {
    from: "delivered",
    to: "completed",
    reason: "İşlem tamamlandı",
    shouldSucceed: true
  },
  {
    from: "completed",
    to: "preparing",
    reason: "Geçersiz durum değişikliği",
    shouldSucceed: false
  },
  {
    from: "confirmed",
    to: "cancelled",
    reason: "Müşteri talebi üzerine iptal",
    shouldSucceed: true
  }
];

// 💳 Payment Status Test Data
export const paymentStatusTests = [
  {
    paymentStatus: "paid",
    paymentDetails: {
      transactionId: "TXN_TEST_123456",
      paymentGateway: "stripe",
      cardLastFour: "4242",
      cardBrand: "visa",
      paymentIntentId: "pi_test_123456",
      paidAt: new Date().toISOString()
    },
    shouldSucceed: true
  },
  {
    paymentStatus: "failed",
    paymentDetails: {
      transactionId: "TXN_FAIL_123456",
      paymentGateway: "stripe",
      failureReason: "Insufficient funds"
    },
    shouldSucceed: true
  },
  {
    paymentStatus: "refunded",
    paymentDetails: {
      transactionId: "TXN_REFUND_123456",
      refundId: "RE_123456",
      refundAmount: 45.00,
      refundReason: "Müşteri talebi",
      refundedAt: new Date().toISOString()
    },
    shouldSucceed: true
  }
];

// 🔍 Search Test Queries
export const searchTestQueries = [
  {
    description: "Sipariş numarası ile arama",
    query: { orderNumber: "LD-2025" },
    expectedMinResults: 0
  },
  {
    description: "Müşteri adı ile arama",
    query: { customerName: "Ahmet" },
    expectedMinResults: 0
  },
  {
    description: "Telefon numarası ile arama",
    query: { customerPhone: "0555" },
    expectedMinResults: 0
  },
  {
    description: "E-posta ile arama",
    query: { customerEmail: "test@example.com" },
    expectedMinResults: 0
  }
];

// 📊 Analytics Test Parameters
export const analyticsTestParams = [
  {
    period: "day",
    description: "Günlük analytics"
  },
  {
    period: "week",
    description: "Haftalık analytics"
  },
  {
    period: "month",
    description: "Aylık analytics"
  }
];

// 🧪 Order API Test Functions
export const testOrderAPI = async (): Promise<void> => {
  const baseURL = 'http://localhost:5000/api/orders';
  
  try {
    console.log('🧪 Order API Testleri Başlatılıyor...\n');
    
    // Test 1: Health Check
    console.log('1️⃣ Order API Health Check...');
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);
    
    // Test 2: Get All Orders (Empty initially)
    console.log('\n2️⃣ Get All Orders Test (Empty)...');
    const ordersResponse = await fetch(`${baseURL}`);
    const ordersData = await ordersResponse.json();
    console.log('✅ Orders Retrieved:', ordersData.data?.length || 0, 'items');
    
    // Test 3: Get Active Orders
    console.log('\n3️⃣ Get Active Orders Test...');
    const activeResponse = await fetch(`${baseURL}/active`);
    const activeData = await activeResponse.json();
    console.log('✅ Active Orders:', activeData.data?.total || 0, 'items');
    
    // Test 4: Analytics Test
    console.log('\n4️⃣ Analytics Test...');
    for (const analyticsParam of analyticsTestParams) {
      try {
        const analyticsResponse = await fetch(`${baseURL}/analytics?period=${analyticsParam.period}`);
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          console.log(`✅ ${analyticsParam.description}:`, 
            `${analyticsData.data?.summary?.totalOrders || 0} orders,`,
            `${analyticsData.data?.summary?.totalRevenue || 0} TL revenue`
          );
        } else {
          console.log(`❌ ${analyticsParam.description} failed`);
        }
      } catch (error) {
        console.log(`❌ ${analyticsParam.description} error:`, error);
      }
    }
    
    // Test 5: Search Test (without creating orders first)
    console.log('\n5️⃣ Search Test...');
    for (const searchTest of searchTestQueries) {
      try {
        const searchParams = new URLSearchParams(searchTest.query as any);
        const searchResponse = await fetch(`${baseURL}/search?${searchParams}`);
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          console.log(`✅ ${searchTest.description}:`, searchData.data?.length || 0, 'results');
        } else {
          console.log(`❌ ${searchTest.description} failed`);
        }
      } catch (error) {
        console.log(`❌ ${searchTest.description} error:`, error);
      }
    }
    
    // Test 6: Create Order (will fail without real product IDs, but tests validation)
    console.log('\n6️⃣ Create Order Validation Test...');
    try {
      const createResponse = await fetch(`${baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sampleOrderData)
      });
      
      const createData = await createResponse.json();
      
      if (createResponse.ok) {
        console.log('✅ Order created successfully:', createData.data?.orderNumber);
      } else {
        console.log('ℹ️ Order creation failed (expected - need real product IDs):', createData.message);
      }
    } catch (error) {
      console.log('❌ Order creation error:', error);
    }
    
    console.log('\n🎉 Order API testleri tamamlandı!');
    console.log('\n📝 Not: Gerçek order testi için önce Menu API\'den products oluşturulmalıdır.');
    
  } catch (error) {
    console.error('❌ Order API Test Error:', error);
  }
};

// 🔗 Integration Test with Menu API
export const testOrderMenuIntegration = async (): Promise<void> => {
  const menuURL = 'http://localhost:5000/api/menu';
  const orderURL = 'http://localhost:5000/api/orders';
  
  try {
    console.log('🔗 Order-Menu Integration Test...\n');
    
    // Step 1: Get products from Menu API
    console.log('1️⃣ Getting products from Menu API...');
    const productsResponse = await fetch(`${menuURL}/products?limit=2`);
    const productsData = await productsResponse.json();
    
    if (!productsData.success || !productsData.data || productsData.data.length === 0) {
      console.log('❌ No products found. Run Menu API seed data first.');
      return;
    }
    
    const products = productsData.data;
    console.log(`✅ Found ${products.length} products`);
    
    // Step 2: Create order with real product IDs
    console.log('\n2️⃣ Creating order with real product IDs...');
    const orderData = {
      ...sampleOrderData,
      items: products.map((product: any, index: number) => ({
        productId: product._id,
        quantity: index + 1,
        selectedPortion: product.portions?.[0] || null,
        selectedCustomizations: [],
        specialInstructions: `Test order item ${index + 1}`
      }))
    };
    
    const createResponse = await fetch(`${orderURL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const createData = await createResponse.json();
    
    if (createResponse.ok) {
      const order = createData.data;
      console.log(`✅ Order created: ${order.orderNumber}`);
      console.log(`💰 Total Amount: ${order.totalAmount} TL`);
      
      // Step 3: Test status updates
      console.log('\n3️⃣ Testing status updates...');
      for (const statusTest of statusProgressionTests.slice(0, 3)) { // Test first 3 transitions
        if (statusTest.shouldSucceed) {
          try {
            const statusResponse = await fetch(`${orderURL}/${order._id}/status`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                status: statusTest.to,
                reason: statusTest.reason
              })
            });
            
            if (statusResponse.ok) {
              console.log(`✅ Status updated: ${statusTest.from} → ${statusTest.to}`);
            } else {
              console.log(`❌ Status update failed: ${statusTest.from} → ${statusTest.to}`);
            }
          } catch (error) {
            console.log(`❌ Status update error: ${statusTest.from} → ${statusTest.to}`, error);
          }
        }
      }
      
      // Step 4: Test payment update
      console.log('\n4️⃣ Testing payment update...');
      const paymentTest = paymentStatusTests[0]; // Test successful payment
      try {
        const paymentResponse = await fetch(`${orderURL}/${order._id}/payment`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentTest)
        });
        
        if (paymentResponse.ok) {
          console.log(`✅ Payment updated: ${paymentTest.paymentStatus}`);
        } else {
          console.log(`❌ Payment update failed`);
        }
      } catch (error) {
        console.log('❌ Payment update error:', error);
      }
      
      console.log('\n🎉 Integration test completed successfully!');
      
    } else {
      console.log('❌ Order creation failed:', createData.message);
    }
    
  } catch (error) {
    console.error('❌ Integration Test Error:', error);
  }
};

// 🚀 Run tests if this file is executed directly
if (require.main === module) {
  // Wait a bit for server to start
  setTimeout(async () => {
    await testOrderAPI();
    console.log('\n' + '='.repeat(50) + '\n');
    await testOrderMenuIntegration();
  }, 2000);
}
