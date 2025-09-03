// 🎯 Mock Backend Service - Using Original Project Data
import { menuData } from '../helpers/menuData';
import { getFoodImagesByCategory } from '../helpers/foodImages';

// 🔧 Type Definitions (to avoid import issues)
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

// 🍽️ Original Project Menu Data (Döner, Makarna, İçecek) with proper images
const MOCK_PRODUCTS: MenuItem[] = menuData.map((item, index) => {
    // Get images for this category
    const categoryImages = getFoodImagesByCategory(item.category);
    // Use a different image for each item in the category
    const imageIndex = index % categoryImages.length;
    const selectedImage = categoryImages[imageIndex];
    
    return {
        ...item,
        // Use working image from foodImages instead of local paths
        image: selectedImage?.url || item.imageWebp || '',
        // Ensure all required fields exist
        isAvailable: item.isAvailable ?? true,
        preparationTime: item.preparationTime ?? 10
    };
});

// 🛒 Mock Orders
const MOCK_ORDERS: Order[] = [
    {
        id: 'LD-2025-001',
        userId: 'user123',
        orderNumber: 'LD-2025-001',
        items: [
            {
                id: '1',
                menuItemId: '1',
                name: 'Adana Kebab',
                price: 85,
                quantity: 1,
                totalPrice: 85,
                specialInstructions: ''
            }
        ],
        status: 'preparing',
        totalAmount: 85,
        deliveryAddress: {
            fullName: 'Ahmet Yılmaz',
            phone: '0555 123 45 67',
            address: 'Merkez Mah. Atatürk Cad. No:123 Mezitli/Mersin',
            city: 'Mersin',
            district: 'Mezitli'
        },
        paymentMethod: 'cash',
        orderDate: new Date(),
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000),
        notes: ''
    }
];

// 🔥 Mock Backend Service Class
class MockBackendService {
    // 🍽️ Menu Methods
    async getProducts(filters: {
        category?: string;
        search?: string;
        limit?: number;
        offset?: number;
    } = {}): Promise<{ products: MenuItem[]; total: number }> {
        // Simulate API delay
        await this.delay(300);

        let filteredProducts = [...MOCK_PRODUCTS];

        // Apply category filter
        if (filters.category && filters.category !== 'all') {
            filteredProducts = filteredProducts.filter(
                product => product.category.toLowerCase() === filters.category?.toLowerCase()
            );
        }

        // Apply search filter
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(
                product =>
                    product.name.toLowerCase().includes(search) ||
                    product.description.toLowerCase().includes(search) ||
                    product.tags.some(tag => tag.toLowerCase().includes(search))
            );
        }

        const total = filteredProducts.length;

        // Apply pagination
        const offset = filters.offset || 0;
        const limit = filters.limit || 50;
        filteredProducts = filteredProducts.slice(offset, offset + limit);

        return {
            products: filteredProducts,
            total
        };
    }

    async getProductById(id: string): Promise<MenuItem | null> {
        await this.delay(200);
        return MOCK_PRODUCTS.find(product => product.id === id) || null;
    }

    async getFeaturedProducts(): Promise<MenuItem[]> {
        await this.delay(250);
        return MOCK_PRODUCTS.filter(product => product.rating >= 4.5).slice(0, 6);
    }

    async getPopularProducts(): Promise<MenuItem[]> {
        await this.delay(250);
        return MOCK_PRODUCTS
            .sort((a, b) => b.reviewCount - a.reviewCount)
            .slice(0, 6);
    }

    async getCategories(): Promise<string[]> {
        await this.delay(150);
        return [...new Set(MOCK_PRODUCTS.map(product => product.category))];
    }

    // 🛒 Order Methods
    async createOrder(orderData: {
        items: Array<{
            menuItemId: string;
            quantity: number;
            specialInstructions?: string;
        }>;
        deliveryAddress: any;
        paymentMethod: string;
        notes?: string;
    }): Promise<Order> {
        await this.delay(500);

        // Calculate order items with product details
        const enrichedItems = orderData.items.map(item => {
            const product = MOCK_PRODUCTS.find(p => p.id === item.menuItemId);
            if (!product) throw new Error(`Product not found: ${item.menuItemId}`);

            return {
                id: this.generateId(),
                menuItemId: item.menuItemId,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                totalPrice: product.price * item.quantity,
                specialInstructions: item.specialInstructions || ''
            };
        });

        const totalAmount = enrichedItems.reduce((sum, item) => sum + item.totalPrice, 0);

        const newOrder: Order = {
            id: this.generateOrderNumber(),
            userId: 'user123', // Would come from auth
            orderNumber: this.generateOrderNumber(),
            items: enrichedItems,
            status: 'pending',
            totalAmount,
            deliveryAddress: orderData.deliveryAddress,
            paymentMethod: orderData.paymentMethod,
            orderDate: new Date(),
            estimatedDeliveryTime: new Date(Date.now() + 45 * 60000), // 45 min
            notes: orderData.notes || ''
        };

        MOCK_ORDERS.unshift(newOrder);
        return newOrder;
    }

    async getOrders(userId?: string): Promise<Order[]> {
        await this.delay(300);
        if (userId) {
            return MOCK_ORDERS.filter(order => order.userId === userId);
        }
        return MOCK_ORDERS;
    }

    async getOrderById(id: string): Promise<Order | null> {
        await this.delay(200);
        return MOCK_ORDERS.find(order => order.id === id) || null;
    }

    // 🔧 Helper Methods
    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private generateOrderNumber(): string {
        return `LD-2025-${String(Date.now()).slice(-6)}`;
    }

    // 📊 Analytics Methods
    async getOrderAnalytics(): Promise<{
        totalOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
        popularProducts: Array<{ name: string; orderCount: number }>;
    }> {
        await this.delay(400);

        return {
            totalOrders: MOCK_ORDERS.length,
            totalRevenue: MOCK_ORDERS.reduce((sum, order) => sum + order.totalAmount, 0),
            averageOrderValue: MOCK_ORDERS.length ?
                MOCK_ORDERS.reduce((sum, order) => sum + order.totalAmount, 0) / MOCK_ORDERS.length : 0,
            popularProducts: MOCK_PRODUCTS
                .sort((a, b) => b.reviewCount - a.reviewCount)
                .slice(0, 5)
                .map(product => ({
                    name: product.name,
                    orderCount: product.reviewCount
                }))
        };
    }
}

// 🚀 Export singleton instance
export const mockBackendService = new MockBackendService();

// 📱 API Response Types
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// 🎯 Mock API Wrapper Functions (to match real backend interface)
export const MockAPI = {
    // Menu endpoints
    getProducts: (filters?: any) => mockBackendService.getProducts(filters),
    getProductById: (id: string) => mockBackendService.getProductById(id),
    getFeaturedProducts: () => mockBackendService.getFeaturedProducts(),
    getPopularProducts: () => mockBackendService.getPopularProducts(),
    getCategories: () => mockBackendService.getCategories(),

    // Order endpoints
    createOrder: (orderData: any) => mockBackendService.createOrder(orderData),
    getOrders: (userId?: string) => mockBackendService.getOrders(userId),
    getOrderById: (id: string) => mockBackendService.getOrderById(id),

    // Analytics
    getAnalytics: () => mockBackendService.getOrderAnalytics()
};
