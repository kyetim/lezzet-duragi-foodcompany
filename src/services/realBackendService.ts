// 🎯 Real Backend Service - Production API Integration

// 🔧 Type Definitions
interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    imageWebp?: string;
    isAvailable?: boolean;
    preparationTime?: number;
    ingredients?: string[];
    allergens?: string[];
}

interface Order {
    id: string;
    userId: string;
    orderNumber: string;
    items: Array<{
        id: string;
        menuItemId: string;
        name: string;
        price: number;
        quantity: number;
        totalPrice: number;
        specialInstructions: string;
    }>;
    status: string;
    totalAmount: number;
    deliveryAddress: any;
    paymentMethod: string;
    orderDate: Date;
    estimatedDeliveryTime?: Date;
    notes?: string;
}

// 🌐 API Base URL Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// 🔧 API Helper Functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const config: RequestInit = {
        ...options,
        headers: defaultHeaders,
    };

    try {
        console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ API Response: ${endpoint}`, data);
        return data;
    } catch (error) {
        console.error(`❌ API Error: ${endpoint}`, error);
        throw error;
    }
};

// 🚀 Real Backend Service Class
class RealBackendService {
    // 🍽️ Menu Methods
    async getProducts(filters: {
        category?: string;
        search?: string;
        limit?: number;
        offset?: number;
    } = {}): Promise<{ products: MenuItem[]; total: number }> {
        const searchParams = new URLSearchParams();
        
        if (filters.category && filters.category !== 'all') {
            searchParams.append('category', filters.category);
        }
        if (filters.search) {
            searchParams.append('search', filters.search);
        }
        if (filters.limit) {
            searchParams.append('limit', filters.limit.toString());
        }
        if (filters.offset) {
            searchParams.append('offset', filters.offset.toString());
        }

        const queryString = searchParams.toString();
        const endpoint = `/api/menu/products${queryString ? `?${queryString}` : ''}`;
        
        const response = await apiRequest(endpoint);
        return response.data;
    }

    async getProductById(id: string): Promise<MenuItem | null> {
        const response = await apiRequest(`/api/menu/products/${id}`);
        return response.data;
    }

    async getFeaturedProducts(): Promise<MenuItem[]> {
        const response = await apiRequest('/api/menu/products/featured');
        return response.data;
    }

    async getPopularProducts(): Promise<MenuItem[]> {
        const response = await apiRequest('/api/menu/products/popular');
        return response.data;
    }

    async getCategories(): Promise<string[]> {
        const response = await apiRequest('/api/menu/categories');
        return response.data;
    }

    // 🛒 Order Methods
    async createOrder(orderData: any): Promise<Order> {
        const response = await apiRequest('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
        return response.data;
    }

    async getOrders(userId?: string): Promise<Order[]> {
        const endpoint = userId ? `/api/orders/user/${userId}` : '/api/orders';
        const response = await apiRequest(endpoint);
        return response.data;
    }

    async getOrderById(id: string): Promise<Order | null> {
        const response = await apiRequest(`/api/orders/${id}`);
        return response.data;
    }

    async updateOrderStatus(id: string, status: string): Promise<Order> {
        const response = await apiRequest(`/api/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        return response.data;
    }

    // 📊 Analytics Methods
    async getOrderAnalytics(): Promise<{
        totalOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
        popularProducts: Array<{ name: string; orderCount: number }>;
    }> {
        const response = await apiRequest('/api/orders/analytics');
        return response.data;
    }

    // 🔧 Health Check
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        const response = await apiRequest('/health');
        return response;
    }
}

// 🚀 Export singleton instance
export const realBackendService = new RealBackendService();

// 🎯 Real API Wrapper Functions (to match mock backend interface)
export const RealAPI = {
    // Menu endpoints
    getProducts: (filters?: any) => realBackendService.getProducts(filters),
    getProductById: (id: string) => realBackendService.getProductById(id),
    getFeaturedProducts: () => realBackendService.getFeaturedProducts(),
    getPopularProducts: () => realBackendService.getPopularProducts(),
    getCategories: () => realBackendService.getCategories(),

    // Order endpoints
    createOrder: (orderData: any) => realBackendService.createOrder(orderData),
    getOrders: (userId?: string) => realBackendService.getOrders(userId),
    getOrderById: (id: string) => realBackendService.getOrderById(id),
    updateOrderStatus: (id: string, status: string) => realBackendService.updateOrderStatus(id, status),

    // Analytics
    getAnalytics: () => realBackendService.getOrderAnalytics(),

    // Health
    healthCheck: () => realBackendService.healthCheck()
};

export default realBackendService;
