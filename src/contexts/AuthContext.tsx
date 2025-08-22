import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  type User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Sepet verilerini localStorage'a kaydet
const saveCartToStorage = (items: any[]): void => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Sepet verilerini localStorage'dan yükle
const loadCartFromStorage = (): any[] => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

// Firestore'da kullanıcı dokümanı oluştur veya güncelle
const createOrUpdateUserDocument = async (user: User) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Kullanıcı dokümanı yoksa oluştur
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        phoneNumber: user.phoneNumber || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('User document created in Firestore');
    } else {
      // Kullanıcı dokümanı varsa güncelle
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || userSnap.data().displayName || '',
        photoURL: user.photoURL || userSnap.data().photoURL || '',
        phoneNumber: user.phoneNumber || userSnap.data().phoneNumber || '',
        updatedAt: new Date()
      }, { merge: true });
      console.log('User document updated in Firestore');
    }
  } catch (error) {
    console.error('Error creating/updating user document:', error);
  }
};

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Kullanıcı login olduğunda sepet verilerini koru ve Firestore dokümanı oluştur
      if (user) {
        // Firestore'da kullanıcı dokümanı oluştur/güncelle
        await createOrUpdateUserDocument(user);
        
        // Kullanıcıya özel sepet anahtarı oluştur
        const userCartKey = `cart_${user.uid}`;
        const currentCart = loadCartFromStorage();
        
        // Eğer kullanıcıya özel sepet varsa onu yükle, yoksa mevcut sepeti kullanıcıya özel olarak kaydet
        const userCart = localStorage.getItem(userCartKey);
        if (userCart) {
          // Kullanıcıya özel sepeti yükle
          localStorage.setItem('cart', userCart);
        } else if (currentCart.length > 0) {
          // Mevcut sepeti kullanıcıya özel olarak kaydet
          localStorage.setItem(userCartKey, JSON.stringify(currentCart));
        }
      } else {
        // Kullanıcı logout olduğunda sepet verilerini koru
        const currentCart = loadCartFromStorage();
        if (currentCart.length > 0) {
          // Sepet verilerini geçici olarak sakla
          localStorage.setItem('guest_cart', JSON.stringify(currentCart));
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await updateProfile(result.user, { displayName });
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Logout öncesi mevcut sepet verilerini sakla
      const currentCart = loadCartFromStorage();
      if (currentCart.length > 0) {
        localStorage.setItem('guest_cart', JSON.stringify(currentCart));
      }
      
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
    googleLogin,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
