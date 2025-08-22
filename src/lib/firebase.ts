import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration
// Bu bilgileri Firebase Console'dan alacaksınız
const firebaseConfig = {
  apiKey: "AIzaSyBP_oV3MQnRXTPEG3wpEMGuAh1T8wP9gfs",
  authDomain: "lezzet-duragi-ca5df.firebaseapp.com",
  projectId: "lezzet-duragi-ca5df",
  storageBucket: "lezzet-duragi-ca5df.firebasestorage.app",
  messagingSenderId: "242218509673",
  appId: "1:242218509673:web:4c41f0981853b7852dc9f8",
  measurementId: "G-HX2Y59Y8QZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Emulator'ları devre dışı bırak - gerçek Firebase servislerini kullan
// Development ortamında emulator'ları kullanmak isterseniz aşağıdaki kodu aktif edin:
/*
if (import.meta.env.DEV) {
  // Firestore emulator'ını bağla (eğer çalışıyorsa)
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.log('Firestore emulator zaten bağlı veya çalışmıyor');
  }
  
  // Auth emulator'ını bağla (eğer çalışıyorsa)
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (error) {
    console.log('Auth emulator zaten bağlı veya çalışmıyor');
  }
}
*/

export default app;
