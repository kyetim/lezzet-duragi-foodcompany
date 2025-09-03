import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

// 🔐 Authenticated Request Interface
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
  };
}

// 🛡️ JWT Token doğrulama middleware
export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Token'ı header'dan al
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Erişim token\'ı gereklidir'
      });
      return;
    }

    const token = authHeader.substring(7); // "Bearer " kısmını çıkar

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Kullanıcıyı veritabanından kontrol et
    const user = await User.findById(decoded.userId).select('_id email role isActive');
    
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Geçersiz token veya kullanıcı bulunamadı'
      });
      return;
    }

    // Request objesine kullanıcı bilgilerini ekle
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      iat: decoded.iat,
      exp: decoded.exp
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
      return;
    }
    
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token süresi dolmuş, lütfen tekrar giriş yapın'
      });
      return;
    }

    console.error('🚨 Auth Middleware Error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication kontrolü sırasında hata oluştu'
    });
  }
};

// 🔑 Role tabanlı yetkilendirme middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gereklidir'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};

// 🏪 Admin yetkisi kontrolü
export const requireAdmin = requireRole(['admin']);

// 👔 Manager/Admin yetkisi kontrolü  
export const requireManager = requireRole(['admin', 'manager']);

// 👨‍🍳 Staff yetkisi kontrolü
export const requireStaff = requireRole(['admin', 'manager', 'staff']);

// 🛡️ Kullanıcının kendi bilgilerine erişim kontrolü
export const requireOwnershipOrAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Kimlik doğrulama gereklidir'
    });
    return;
  }

  const { userId } = req.params;
  const currentUserId = req.user.userId;
  const currentUserRole = req.user.role;

  // Admin veya kendi verilerine erişim
  if (currentUserRole === 'admin' || currentUserId === userId) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: 'Bu bilgilere erişim yetkiniz bulunmamaktadır'
  });
};

// 🔒 Rate limiting için kullanıcı bazlı kontrol
export const getUserFromToken = (req: AuthenticatedRequest): string => {
  return req.user?.userId || req.ip || 'anonymous';
};

// ⏰ Optional auth - Token varsa doğrula, yoksa devam et
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Token yoksa devam et
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await User.findById(decoded.userId).select('_id email role isActive');
    
    if (user && user.isActive) {
      req.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        iat: decoded.iat,
        exp: decoded.exp
      };
    }

    next();
  } catch (error) {
    // Token hatası varsa da devam et (optional auth)
    next();
  }
};