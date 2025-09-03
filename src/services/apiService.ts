// 🎯 API Service - Smart Switch between Mock and Real Backend

import { MockAPI } from './mockBackendService';
import { RealAPI } from './realBackendService';

// 🔧 Environment Configuration
const BACKEND_MODE = import.meta.env.VITE_BACKEND_MODE || 'development';
const IS_DEVELOPMENT = import.meta.env.DEV;

// 🚀 Smart API Selection
const selectAPI = () => {
    // Force mock in development if no backend is configured
    if (IS_DEVELOPMENT && BACKEND_MODE === 'development') {
        console.log('🔧 API Mode: Mock Backend (Development)');
        return MockAPI;
    }
    
    // Use real API in production or when explicitly configured
    if (BACKEND_MODE === 'production' || BACKEND_MODE === 'real') {
        console.log('🌐 API Mode: Real Backend (Production)');
        return RealAPI;
    }
    
    // Default to mock for safety
    console.log('🔧 API Mode: Mock Backend (Default)');
    return MockAPI;
};

// 🎯 Export the selected API
export const API = selectAPI();

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
