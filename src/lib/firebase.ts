import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

export default app;
