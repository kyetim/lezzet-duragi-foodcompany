import express from 'express';
import {
  getAllProducts,
  getProductById,
  createNewProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getFeaturedProducts,
  getPopularProducts,
  getProductAnalytics
} from '../controllers/menuController';

// Auth middleware imports
import { verifyFirebaseToken, requireFirebaseManager, requireFirebaseAdmin } from '../middleware/firebaseAuth';

// Create router instance
const router = express.Router();

// 📝 Route documentation
/*
  🍽️ MENU API ROUTES
  
  Public Routes (Frontend için):
  GET    /api/menu/products           → Tüm ürünleri listele (pagination, filters)
  GET    /api/menu/products/featured  → Öne çıkan ürünler
  GET    /api/menu/products/popular   → Popüler ürünler  
  GET    /api/menu/products/search    → Gelişmiş ürün arama
  GET    /api/menu/products/:id       → Tek ürün detayı
  
  Admin Routes (Admin panel için):
  POST   /api/menu/products           → Yeni ürün oluştur
  PUT    /api/menu/products/:id       → Ürün güncelle
  DELETE /api/menu/products/:id       → Ürün sil (soft delete)
  GET    /api/menu/products/:id/analytics → Ürün analytics
  
  Query Parameters:
  - page: Sayfa numarası (default: 1)
  - limit: Sayfa başına item (default: 20, max: 100)
  - category: Kategori ID'si
  - search: Metin arama
  - minPrice, maxPrice: Fiyat aralığı
  - isAvailable: true/false
  - isPopular: true/false
  - isFeatured: true/false
  - sortBy: Sıralama alanı (default: createdAt)
  - sortOrder: asc/desc (default: desc)
*/

// 🌍 Public Routes (Frontend tarafından kullanılacak)

// GET /api/menu/products/featured - Öne çıkan ürünler (önce tanımla)
router.get('/products/featured', getFeaturedProducts);

// GET /api/menu/products/popular - Popüler ürünler
router.get('/products/popular', getPopularProducts);

// GET /api/menu/products/search - Gelişmiş arama
router.get('/products/search', searchProducts);

// GET /api/menu/products - Tüm ürünleri listele
router.get('/products', getAllProducts);

// GET /api/menu/products/:id - Tek ürün detayı
router.get('/products/:id', getProductById);

// 🔐 Admin Routes (İleride auth middleware eklenecek)

// POST /api/menu/products - Yeni ürün oluştur
router.post('/products', 
  verifyFirebaseToken,
  requireFirebaseManager,
  createNewProduct
);

// PUT /api/menu/products/:id - Ürün güncelle
router.put('/products/:id',
  verifyFirebaseToken,
  requireFirebaseManager,
  updateProduct
);

// DELETE /api/menu/products/:id - Ürün sil
router.delete('/products/:id',
  verifyFirebaseToken,
  requireFirebaseAdmin,
  deleteProduct
);

// GET /api/menu/products/:id/analytics - Ürün analytics (Admin only)
router.get('/products/:id/analytics',
  verifyFirebaseToken,
  requireFirebaseManager,
  getProductAnalytics
);

// 🏥 Health check for menu API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Menu API çalışıyor',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/menu/products',
      'GET /api/menu/products/featured',
      'GET /api/menu/products/popular',
      'GET /api/menu/products/search',
      'GET /api/menu/products/:id',
      'POST /api/menu/products (Admin)',
      'PUT /api/menu/products/:id (Admin)',
      'DELETE /api/menu/products/:id (Admin)',
      'GET /api/menu/products/:id/analytics (Admin)'
    ]
  });
});

// 🔍 Route not found handler for menu routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Menu API endpoint bulunamadı',
    availableEndpoints: [
      'GET /api/menu/products',
      'GET /api/menu/products/featured',
      'GET /api/menu/products/popular',
      'GET /api/menu/products/search',
      'GET /api/menu/products/:id'
    ]
  });
});

export default router;
