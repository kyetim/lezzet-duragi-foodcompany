import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createNewOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  searchOrders,
  getActiveOrders,
  getOrderAnalytics
} from '../controllers/orderController';

// Validation middleware imports
import {
  validateObjectId,
  validateQueryParams,
  sanitizeInput
} from '../middleware/validation';

// Auth middleware imports
import { requireAuth, requireStaff, requireManager, optionalAuth } from '../middleware/auth';

// Create router instance
const router = express.Router();

// 📝 Route documentation
/*
  🛒 ORDER API ROUTES
  
  Customer Routes:
  POST   /api/orders                    → Yeni sipariş oluştur
  GET    /api/orders?customerId=:id     → Müşteri siparişleri
  GET    /api/orders/:id                → Sipariş detayı
  DELETE /api/orders/:id                → Sipariş iptal et (conditions apply)
  
  Admin Routes:
  GET    /api/orders                    → Tüm siparişler (pagination, filters)
  GET    /api/orders/active             → Aktif siparişler (dashboard)
  GET    /api/orders/search             → Sipariş arama
  GET    /api/orders/analytics          → Sipariş analytics
  PUT    /api/orders/:id/status         → Sipariş durumu güncelle
  PUT    /api/orders/:id/payment        → Ödeme durumu güncelle
  
  Staff Routes:
  GET    /api/orders/active             → Kitchen/delivery için aktif siparişler
  PUT    /api/orders/:id/status         → Durum güncelleme (limited)
  
  Query Parameters:
  - page, limit: Pagination
  - customerId: Müşteri filtresi
  - status: Durum filtresi (array supported)
  - paymentMethod: Ödeme yöntemi
  - deliveryType: Teslimat tipi
  - startDate, endDate: Tarih aralığı
  - minAmount, maxAmount: Tutar aralığı
  - sortBy, sortOrder: Sıralama
*/

// 🌍 Public/Customer Routes

// POST /api/orders - Yeni sipariş oluştur
router.post('/', 
  sanitizeInput,
  requireAuth,
  createNewOrder
);

// GET /api/orders - Siparişleri listele (customer kendi siparişlerini, admin hepsini görebilir)
router.get('/', 
  validateQueryParams,
  requireAuth,
  getAllOrders
);

// GET /api/orders/active - Aktif siparişler (Staff/Admin için)
router.get('/active',
  requireAuth,
  requireStaff,
  getActiveOrders
);

// GET /api/orders/search - Sipariş arama (Admin için)
router.get('/search',
  requireAuth,
  requireManager,
  searchOrders
);

// GET /api/orders/analytics - Sipariş analytics (Admin için)
router.get('/analytics',
  requireAuth,
  requireManager,
  getOrderAnalytics
);

// GET /api/orders/:id - Tek sipariş detayı
router.get('/:id', 
  validateObjectId('id'),
  requireAuth,
  getOrderById
);

// 🔐 Admin/Staff Routes

// PUT /api/orders/:id/status - Sipariş durumu güncelle
router.put('/:id/status',
  validateObjectId('id'),
  sanitizeInput,
  requireAuth,
  requireStaff,
  updateOrderStatus
);

// PUT /api/orders/:id/payment - Ödeme durumu güncelle
router.put('/:id/payment',
  validateObjectId('id'),
  sanitizeInput,
  requireAuth,
  requireManager,
  updatePaymentStatus
);

// DELETE /api/orders/:id - Sipariş iptal et
router.delete('/:id',
  validateObjectId('id'),
  sanitizeInput,
  requireAuth,
  cancelOrder
);

// 🏥 Health check for order API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Order API çalışıyor',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/orders',
      'GET /api/orders',
      'GET /api/orders/active',
      'GET /api/orders/search',
      'GET /api/orders/analytics',
      'GET /api/orders/:id',
      'PUT /api/orders/:id/status',
      'PUT /api/orders/:id/payment',
      'DELETE /api/orders/:id'
    ],
    orderStatuses: [
      'pending', 'confirmed', 'preparing', 'ready',
      'out-for-delivery', 'delivered', 'completed', 'cancelled', 'refunded'
    ],
    paymentStatuses: [
      'pending', 'paid', 'failed', 'refunded', 'partial'
    ]
  });
});

// 🔍 Route not found handler for order routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Order API endpoint bulunamadı',
    availableEndpoints: [
      'POST /api/orders',
      'GET /api/orders',
      'GET /api/orders/active',
      'GET /api/orders/search',
      'GET /api/orders/analytics',
      'GET /api/orders/:id',
      'PUT /api/orders/:id/status',
      'PUT /api/orders/:id/payment',
      'DELETE /api/orders/:id'
    ]
  });
});

export default router;
