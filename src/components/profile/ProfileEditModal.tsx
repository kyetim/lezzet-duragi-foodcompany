import React, { useState, useEffect } from 'react';
import { X, Camera, User, Mail, Phone, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User as FirebaseUser } from 'firebase/auth';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profileData: ProfileData) => Promise<void>;
    onPasswordChange: (passwordData: PasswordChangeData) => Promise<void>;
    user: FirebaseUser | null;
}

interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
}

interface ProfileData {
    displayName: string;
    email: string;
    phoneNumber: string;
    photoURL?: string;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onPasswordChange,
    user
}) => {
    const [formData, setFormData] = useState<ProfileData>({
        displayName: '',
        email: '',
        phoneNumber: '',
        photoURL: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                photoURL: user.photoURL || ''
            });
        }
    }, [user]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Ad soyad gereklidir';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'E-posta gereklidir';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi giriniz';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Telefon numarası gereklidir';
        } else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Geçerli bir telefon numarası giriniz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        const newErrors: Record<string, string> = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Mevcut şifre gereklidir';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'Yeni şifre gereklidir';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Şifre en az 6 karakter olmalıdır';
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Şifre onayı gereklidir';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validatePasswordForm()) return;

        setIsLoading(true);
        try {
            await onPasswordChange({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setShowPasswordForm(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error changing password:', error);
            // Hata mesajını kullanıcıya göster
            setErrors(prev => ({ ...prev, passwordChange: 'Şifre değiştirme işlemi başarısız oldu. Lütfen tekrar deneyin.' }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {showPasswordForm ? 'Şifre Değiştir' : 'Profil Düzenle'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {!showPasswordForm ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Profile Photo */}
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                {formData.photoURL ? (
                                                    <img
                                                        src={formData.photoURL}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-12 h-12 text-gray-400" />
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                                            >
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Display Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ad Soyad
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.displayName}
                                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                                                    errors.displayName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Adınız ve soyadınız"
                                            />
                                        </div>
                                        {errors.displayName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            E-posta
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="ornek@email.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefon Numarası
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={formData.phoneNumber}
                                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                                                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="+90 555 123 45 67"
                                            />
                                        </div>
                                        {errors.phoneNumber && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                                        )}
                                    </div>

                                    {/* Password Change Button */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordForm(true)}
                                            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                                        >
                                            <Lock className="w-4 h-4" />
                                            <span>Şifre Değiştir</span>
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    {/* Current Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mevcut Şifre
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                                                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Mevcut şifrenizi girin"
                                            />
                                        </div>
                                        {errors.currentPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                                        )}
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Yeni Şifre
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                                                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Yeni şifrenizi girin"
                                            />
                                        </div>
                                        {errors.newPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Şifre Onayı
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Yeni şifrenizi tekrar girin"
                                            />
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordForm(false)}
                                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            Geri
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isLoading ? 'Değiştiriliyor...' : 'Şifre Değiştir'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
