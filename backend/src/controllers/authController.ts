import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { AuthenticatedRequest } from '../middleware/auth';

// 🎯 Standard Response Interface
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

// 🔧 Helper function for sending responses
const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  errors?: any
): void => {
  const response: ApiResponse<T> = {
    success,
    message,
    ...(data && { data }),
    ...(errors && { errors })
  };
  res.status(statusCode).json(response);
};

// 📝 User Registration
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 POST /api/auth/register - Kullanıcı kaydı');
    
    const { email, password, firstName, lastName, phone } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      sendResponse(res, 400, false, 'Email, şifre, ad ve soyad gereklidir');
      return;
    }

    if (password.length < 6) {
      sendResponse(res, 400, false, 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      sendResponse(res, 400, false, 'Bu e-posta adresi zaten kullanımda');
      return;
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone,
      role: 'customer'
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = await user.generateAuthTokens();

    // Prepare user data (exclude sensitive fields)
    const userData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      loyaltyPoints: user.loyaltyPoints,
      createdAt: user.createdAt
    };

    sendResponse(res, 201, true, 'Kullanıcı başarıyla oluşturuldu', {
      user: userData,
      accessToken,
      refreshToken
    });

  } catch (error: any) {
    console.error('❌ Register Error:', error);
    if (error.code === 11000) {
      sendResponse(res, 400, false, 'Bu e-posta adresi zaten kullanımda');
    } else {
      sendResponse(res, 500, false, 'Kullanıcı oluşturulurken hata oluştu', null, error.message);
    }
  }
};

// 🔑 User Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔑 POST /api/auth/login - Kullanıcı girişi');
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      sendResponse(res, 400, false, 'Email ve şifre gereklidir');
      return;
    }

    // Find user with password field
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password');

    if (!user) {
      sendResponse(res, 401, false, 'Geçersiz e-posta veya şifre');
      return;
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockTimeRemaining = Math.ceil((user.lockUntil!.getTime() - Date.now()) / (1000 * 60));
      sendResponse(res, 423, false, `Hesap kilitli. ${lockTimeRemaining} dakika sonra tekrar deneyin`);
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      sendResponse(res, 401, false, 'Geçersiz e-posta veya şifre');
      return;
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = await user.generateAuthTokens();

    // Prepare user data
    const userData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      loyaltyPoints: user.loyaltyPoints,
      totalOrders: user.totalOrders,
      lastLoginAt: user.lastLoginAt
    };

    sendResponse(res, 200, true, 'Giriş başarılı', {
      user: userData,
      accessToken,
      refreshToken
    });

  } catch (error: any) {
    console.error('❌ Login Error:', error);
    sendResponse(res, 500, false, 'Giriş yapılırken hata oluştu', null, error.message);
  }
};

// 🚪 User Logout
export const logoutUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('🚪 POST /api/auth/logout - Kullanıcı çıkışı');
    
    const userId = req.user!.userId;
    const { refreshToken } = req.body;

    // Remove refresh token from user's tokens array
    if (refreshToken) {
      await User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken }
      });
    }

    sendResponse(res, 200, true, 'Çıkış başarılı');

  } catch (error: any) {
    console.error('❌ Logout Error:', error);
    sendResponse(res, 500, false, 'Çıkış yapılırken hata oluştu', null, error.message);
  }
};

// 🔄 Refresh Token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔄 POST /api/auth/refresh-token - Token yenileme');
    
    const { refreshToken } = req.body;

    if (!refreshToken) {
      sendResponse(res, 400, false, 'Refresh token gereklidir');
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    
    // Find user and check if refresh token exists
    const user = await User.findOne({
      _id: decoded.userId,
      refreshTokens: refreshToken,
      isActive: true
    });

    if (!user) {
      sendResponse(res, 401, false, 'Geçersiz refresh token');
      return;
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await user.generateAuthTokens();

    // Remove old refresh token
    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
    await user.save();

    sendResponse(res, 200, true, 'Token yenilendi', {
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (error: any) {
    console.error('❌ Refresh Token Error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      sendResponse(res, 401, false, 'Geçersiz refresh token');
    } else {
      sendResponse(res, 500, false, 'Token yenilenirken hata oluştu', null, error.message);
    }
  }
};

// 📧 Forgot Password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📧 POST /api/auth/forgot-password - Şifre sıfırlama isteği');
    
    const { email } = req.body;

    if (!email) {
      sendResponse(res, 400, false, 'Email gereklidir');
      return;
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      // Security: Don't reveal if email exists
      sendResponse(res, 200, true, 'Eğer e-posta sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderilecektir');
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // TODO: Send email with reset link
    // const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // await sendResetPasswordEmail(user.email, resetURL);

    sendResponse(res, 200, true, 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');

  } catch (error: any) {
    console.error('❌ Forgot Password Error:', error);
    sendResponse(res, 500, false, 'Şifre sıfırlama isteği işlenirken hata oluştu', null, error.message);
  }
};

// 🔐 Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔐 POST /api/auth/reset-password - Şifre sıfırlama');
    
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      sendResponse(res, 400, false, 'Token ve yeni şifre gereklidir');
      return;
    }

    if (newPassword.length < 6) {
      sendResponse(res, 400, false, 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
      isActive: true
    });

    if (!user) {
      sendResponse(res, 400, false, 'Geçersiz veya süresi dolmuş token');
      return;
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Invalidate all refresh tokens
    await user.save();

    sendResponse(res, 200, true, 'Şifre başarıyla güncellendi');

  } catch (error: any) {
    console.error('❌ Reset Password Error:', error);
    sendResponse(res, 500, false, 'Şifre sıfırlanırken hata oluştu', null, error.message);
  }
};

// ✅ Verify Email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('✅ POST /api/auth/verify-email - Email doğrulama');
    
    const { token } = req.body;

    if (!token) {
      sendResponse(res, 400, false, 'Doğrulama token\'ı gereklidir');
      return;
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
      isActive: true
    });

    if (!user) {
      sendResponse(res, 400, false, 'Geçersiz veya süresi dolmuş doğrulama token\'ı');
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    sendResponse(res, 200, true, 'E-posta başarıyla doğrulandı');

  } catch (error: any) {
    console.error('❌ Verify Email Error:', error);
    sendResponse(res, 500, false, 'E-posta doğrulanırken hata oluştu', null, error.message);
  }
};

// 📤 Resend Verification Email
export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📤 POST /api/auth/resend-verification - Email doğrulama tekrar gönder');
    
    const { email } = req.body;

    if (!email) {
      sendResponse(res, 400, false, 'Email gereklidir');
      return;
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      sendResponse(res, 200, true, 'Eğer e-posta sistemde kayıtlıysa, doğrulama bağlantısı gönderilecektir');
      return;
    }

    if (user.isEmailVerified) {
      sendResponse(res, 400, false, 'E-posta zaten doğrulanmış');
      return;
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // TODO: Send verification email
    // const verificationURL = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    // await sendVerificationEmail(user.email, verificationURL);

    sendResponse(res, 200, true, 'Doğrulama e-postası gönderildi');

  } catch (error: any) {
    console.error('❌ Resend Verification Error:', error);
    sendResponse(res, 500, false, 'Doğrulama e-postası gönderilirken hata oluştu', null, error.message);
  }
};

// 👤 Get Current User
export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('👤 GET /api/auth/me - Mevcut kullanıcı bilgileri');
    
    const userId = req.user!.userId;
    
    const user = await User.findById(userId).select('-password -refreshTokens');
    
    if (!user) {
      sendResponse(res, 404, false, 'Kullanıcı bulunamadı');
      return;
    }

    sendResponse(res, 200, true, 'Kullanıcı bilgileri', { user });

  } catch (error: any) {
    console.error('❌ Get Current User Error:', error);
    sendResponse(res, 500, false, 'Kullanıcı bilgileri alınırken hata oluştu', null, error.message);
  }
};

// ✏️ Update Profile
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('✏️ PUT /api/auth/profile - Profil güncelleme');
    
    const userId = req.user!.userId;
    const { firstName, lastName, phone, dateOfBirth, gender, preferences } = req.body;

    const updateData: any = {};
    
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    if (!user) {
      sendResponse(res, 404, false, 'Kullanıcı bulunamadı');
      return;
    }

    sendResponse(res, 200, true, 'Profil başarıyla güncellendi', { user });

  } catch (error: any) {
    console.error('❌ Update Profile Error:', error);
    sendResponse(res, 500, false, 'Profil güncellenirken hata oluştu', null, error.message);
  }
};

// 🔒 Change Password
export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('🔒 PUT /api/auth/change-password - Şifre değiştirme');
    
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      sendResponse(res, 400, false, 'Mevcut şifre ve yeni şifre gereklidir');
      return;
    }

    if (newPassword.length < 6) {
      sendResponse(res, 400, false, 'Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      sendResponse(res, 404, false, 'Kullanıcı bulunamadı');
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      sendResponse(res, 400, false, 'Mevcut şifre yanlış');
      return;
    }

    // Update password
    user.password = newPassword;
    user.refreshTokens = []; // Invalidate all refresh tokens
    await user.save();

    sendResponse(res, 200, true, 'Şifre başarıyla değiştirildi');

  } catch (error: any) {
    console.error('❌ Change Password Error:', error);
    sendResponse(res, 500, false, 'Şifre değiştirilirken hata oluştu', null, error.message);
  }
};

// 🗑️ Delete Account
export const deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('🗑️ DELETE /api/auth/account - Hesap silme');
    
    const userId = req.user!.userId;
    const { password } = req.body;

    if (!password) {
      sendResponse(res, 400, false, 'Hesap silmek için şifre gereklidir');
      return;
    }

    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      sendResponse(res, 404, false, 'Kullanıcı bulunamadı');
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      sendResponse(res, 400, false, 'Yanlış şifre');
      return;
    }

    // Soft delete - mark as inactive
    user.isActive = false;
    user.refreshTokens = [];
    await user.save();

    sendResponse(res, 200, true, 'Hesap başarıyla silindi');

  } catch (error: any) {
    console.error('❌ Delete Account Error:', error);
    sendResponse(res, 500, false, 'Hesap silinirken hata oluştu', null, error.message);
  }
};