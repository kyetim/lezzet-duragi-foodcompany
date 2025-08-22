import { 
    updateProfile, 
    updateEmail, 
    updatePassword, 
    reauthenticateWithCredential,
    EmailAuthProvider,
    type User 
} from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProfileData {
    displayName: string;
    email: string;
    phoneNumber: string;
    photoURL?: string;
}

interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
}

export const profileService = {
    // Profil bilgilerini güncelle
    async updateProfile(user: User, profileData: ProfileData): Promise<void> {
        try {
            // Firebase Auth profilini güncelle
            await updateProfile(user, {
                displayName: profileData.displayName,
                photoURL: profileData.photoURL
            });

            // E-posta değişikliği varsa güncelle
            if (profileData.email !== user.email) {
                await updateEmail(user, profileData.email);
            }

            // Firestore'da kullanıcı dokümanını güncelle
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    displayName: profileData.displayName,
                    email: profileData.email,
                    phoneNumber: profileData.phoneNumber,
                    photoURL: profileData.photoURL,
                    updatedAt: new Date()
                });
            } catch (firestoreError) {
                console.warn('Firestore update failed, but Auth update succeeded:', firestoreError);
                // Firestore hatası olsa bile Auth güncellemesi başarılı olduğu için devam et
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    // Şifre değiştir
    async changePassword(user: User, passwordData: PasswordChangeData): Promise<void> {
        try {
            // Kullanıcıyı yeniden doğrula
            const credential = EmailAuthProvider.credential(
                user.email!,
                passwordData.currentPassword
            );
            
            await reauthenticateWithCredential(user, credential);

            // Şifreyi güncelle
            await updatePassword(user, passwordData.newPassword);

            // Firestore'da şifre değişikliği kaydını tut
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                passwordChangedAt: new Date(),
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    },

    // Kullanıcı profil bilgilerini getir
    async getUserProfile(userId: string): Promise<any> {
        try {
            const userRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                throw new Error('User profile not found');
            }
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    },

    // Profil fotoğrafı yükle (placeholder - gerçek implementasyon için Firebase Storage kullanılabilir)
    async uploadProfilePhoto(user: User, file: File): Promise<string> {
        try {
            // TODO: Firebase Storage implementasyonu
            // Şimdilik placeholder URL döndürüyoruz
            const photoURL = URL.createObjectURL(file);
            
            // Firebase Auth profilini güncelle
            await updateProfile(user, { photoURL });

            // Firestore'da güncelle
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                photoURL,
                updatedAt: new Date()
            });

            return photoURL;
        } catch (error) {
            console.error('Error uploading profile photo:', error);
            throw error;
        }
    }
};
