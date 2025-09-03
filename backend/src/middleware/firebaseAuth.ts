import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// 🔥 Firebase Admin SDK initialization
if (!admin.apps.length) {
  try {
    // Service Account Key'i environment variable'dan yükle
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || 'lezzet-duragi-ca5df'
      });
      console.log('✅ Firebase Admin SDK initialized');
    } else {
      console.warn('⚠️ Firebase Service Account Key bulunamadı, admin SDK kullanılamayacak');
    }
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization error:', error);
  }
}

// 🔐 Firebase Auth Token doğrulama interface
export interface FirebaseAuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
    emailVerified: boolean;
    customClaims?: { [key: string]: any };
    role?: string;
  };
}

// 🛡️ Firebase ID Token doğrulama middleware
export const verifyFirebaseToken = async (
  req: FirebaseAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Authorization header'dan token al
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authorization token gereklidir'
      });
      return;
    }

    const idToken = authHeader.substring(7); // "Bearer " kısmını çıkar

    // Firebase Admin SDK ile token'ı doğrula
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Request objesine kullanıcı bilgilerini ekle
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      emailVerified: decodedToken.email_verified || false,
      customClaims: decodedToken.custom_claims,
      role: decodedToken.custom_claims?.role || 'customer'
    };

    next();
  } catch (error: any) {
    console.error('🚨 Firebase Token Verification Error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      res.status(401).json({
        success: false,
        message: 'Token süresi dolmuş, lütfen tekrar giriş yapın'
      });
    } else if (error.code === 'auth/id-token-revoked') {
      res.status(401).json({
        success: false,
        message: 'Token iptal edilmiş, lütfen tekrar giriş yapın'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    }
  }
};

// 🔑 Firebase Role tabanlı yetkilendirme
export const requireFirebaseRole = (allowedRoles: string[]) => {
  return (req: FirebaseAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gereklidir'
      });
      return;
    }

    const userRole = req.user.role || 'customer';
    
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır',
        requiredRoles: allowedRoles,
        userRole: userRole
      });
      return;
    }

    next();
  };
};

// 🏪 Firebase Admin yetkisi kontrolü
export const requireFirebaseAdmin = requireFirebaseRole(['admin']);

// 👔 Firebase Manager/Admin yetkisi kontrolü  
export const requireFirebaseManager = requireFirebaseRole(['admin', 'manager']);

// 👨‍🍳 Firebase Staff yetkisi kontrolü
export const requireFirebaseStaff = requireFirebaseRole(['admin', 'manager', 'staff']);

// 🛡️ Kullanıcının kendi bilgilerine erişim kontrolü (Firebase)
export const requireFirebaseOwnershipOrAdmin = async (
  req: FirebaseAuthRequest,
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
  const currentUserId = req.user.uid;
  const currentUserRole = req.user.role || 'customer';

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

// ⏰ Optional Firebase auth - Token varsa doğrula, yoksa devam et
export const optionalFirebaseAuth = async (
  req: FirebaseAuthRequest,
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

    const idToken = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      emailVerified: decodedToken.email_verified || false,
      customClaims: decodedToken.custom_claims,
      role: decodedToken.custom_claims?.role || 'customer'
    };

    next();
  } catch (error) {
    // Token hatası varsa da devam et (optional auth)
    next();
  }
};

// 🔧 Custom Claims (Role) ayarlama utility
export const setUserRole = async (uid: string, role: string): Promise<void> => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`✅ Kullanıcı ${uid} rolü ${role} olarak ayarlandı`);
  } catch (error) {
    console.error('❌ Role ayarlama hatası:', error);
    throw error;
  }
};

// 📧 Email doğrulama kontrolü
export const requireEmailVerified = (
  req: FirebaseAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Kimlik doğrulama gereklidir'
    });
    return;
  }

  if (!req.user.emailVerified) {
    res.status(403).json({
      success: false,
      message: 'Bu işlem için e-posta doğrulama gereklidir'
    });
    return;
  }

  next();
};