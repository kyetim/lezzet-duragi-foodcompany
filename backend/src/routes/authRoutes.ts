import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/authController';

// Middleware imports
import { requireAuth, optionalAuth } from '../middleware/auth';
import { sanitizeInput } from '../middleware/validation';

// Create router instance
const router = express.Router();

// 📝 Route documentation
/*
  🔐 AUTHENTICATION API ROUTES
  
  Public Routes:
  POST   /api/auth/register              → Kullanıcı kaydı
  POST   /api/auth/login                 → Kullanıcı girişi
  POST   /api/auth/refresh-token         → Token yenileme
  POST   /api/auth/forgot-password       → Şifre sıfırlama isteği
  POST   /api/auth/reset-password        → Şifre sıfırlama
  POST   /api/auth/verify-email          → Email doğrulama
  POST   /api/auth/resend-verification   → Email doğrulama tekrar gönder
  
  Protected Routes (Require Auth):
  POST   /api/auth/logout                → Kullanıcı çıkışı
  GET    /api/auth/me                    → Mevcut kullanıcı bilgileri
  PUT    /api/auth/profile               → Profil güncelleme
  PUT    /api/auth/change-password       → Şifre değiştirme
  DELETE /api/auth/account               → Hesap silme
  
  Request/Response Examples:
  
  POST /api/auth/register
  {
    "email": "user@example.com",
    "password": "123456",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "phone": "05551234567"
  }
  
  POST /api/auth/login
  {
    "email": "user@example.com", 
    "password": "123456"
  }
  
  Response:
  {
    "success": true,
    "message": "Giriş başarılı",
    "data": {
      "user": { ... },
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
*/

// 🌍 Public Routes

// POST /api/auth/register - Kullanıcı kaydı
router.post('/register',
  sanitizeInput,
  registerUser
);

// POST /api/auth/login - Kullanıcı girişi
router.post('/login',
  sanitizeInput,
  loginUser
);

// POST /api/auth/refresh-token - Token yenileme
router.post('/refresh-token',
  sanitizeInput,
  refreshToken
);

// POST /api/auth/forgot-password - Şifre sıfırlama isteği
router.post('/forgot-password',
  sanitizeInput,
  forgotPassword
);

// POST /api/auth/reset-password - Şifre sıfırlama
router.post('/reset-password',
  sanitizeInput,
  resetPassword
);

// POST /api/auth/verify-email - Email doğrulama
router.post('/verify-email',
  sanitizeInput,
  verifyEmail
);

// POST /api/auth/resend-verification - Email doğrulama tekrar gönder
router.post('/resend-verification',
  sanitizeInput,
  resendVerificationEmail
);

// 🔐 Protected Routes (Require Authentication)

// POST /api/auth/logout - Kullanıcı çıkışı
router.post('/logout',
  requireAuth,
  logoutUser
);

// GET /api/auth/me - Mevcut kullanıcı bilgileri
router.get('/me',
  requireAuth,
  getCurrentUser
);

// PUT /api/auth/profile - Profil güncelleme
router.put('/profile',
  requireAuth,
  sanitizeInput,
  updateProfile
);

// PUT /api/auth/change-password - Şifre değiştirme
router.put('/change-password',
  requireAuth,
  sanitizeInput,
  changePassword
);

// DELETE /api/auth/account - Hesap silme
router.delete('/account',
  requireAuth,
  deleteAccount
);

// 🏥 Health check for auth API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Auth API çalışıyor',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/refresh-token',
      'POST /api/auth/forgot-password',
      'POST /api/auth/reset-password',
      'POST /api/auth/verify-email',
      'POST /api/auth/resend-verification',
      'POST /api/auth/logout (Auth)',
      'GET /api/auth/me (Auth)',
      'PUT /api/auth/profile (Auth)',
      'PUT /api/auth/change-password (Auth)',
      'DELETE /api/auth/account (Auth)'
    ]
  });
});

// 🔍 Route not found handler for auth routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Auth API endpoint bulunamadı',
    availableEndpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/refresh-token',
      'POST /api/auth/forgot-password',
      'POST /api/auth/reset-password',
      'POST /api/auth/verify-email',
      'POST /api/auth/resend-verification',
      'POST /api/auth/logout',
      'GET /api/auth/me',
      'PUT /api/auth/profile',
      'PUT /api/auth/change-password',
      'DELETE /api/auth/account'
    ]
  });
});

export default router;