// 🎯 API Service - Firebase-Only Architecture
// This project uses Firebase Auth + Firestore directly
// Mock data is used for menu display only

import { MockAPI } from './mockBackendService';

// 🔧 Firebase-Only Mode
console.log('🔥 API Mode: Firebase + Mock Menu Data');

// 🎯 Export Mock API for menu data
// Note: Auth, orders, profiles use Firebase directly via services
export const API = MockAPI;

// 🔧 API Health Check (for testing real backend connection)
export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        if (BACKEND_MODE === 'production' || BACKEND_MODE === 'real') {
            await RealAPI.healthCheck();
            console.log('✅ Real Backend: Healthy');
            return true;
        }

        // Mock is always "healthy"
        console.log('✅ Mock Backend: Always Ready');
        return true;
    } catch (error) {
        console.error('❌ Backend Health Check Failed:', error);
        return false;
    }
};

// 🔄 Force Switch API (for testing purposes)
export const switchToRealAPI = () => {
    console.log('🔄 Switching to Real API...');
    return RealAPI;
};

export const switchToMockAPI = () => {
    console.log('🔄 Switching to Mock API...');
    return MockAPI;
};

// 📊 API Status Information
export const getAPIStatus = () => {
    return {
        mode: BACKEND_MODE,
        isDevelopment: IS_DEVELOPMENT,
        usingMock: API === MockAPI,
        usingReal: API === RealAPI,
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'Not configured'
    };
};

export default API;
