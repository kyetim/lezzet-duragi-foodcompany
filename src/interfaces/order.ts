export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    deliveryType: 'pickup' | 'delivery';
    deliveryAddress?: Address;
    createdAt: Date;
    estimatedDeliveryTime?: Date;
    notes?: string;
}

export interface OrderItem {
    menuItemId: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
}

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'delivered'
    | 'cancelled';

export interface Address {
    street: string;
    city: string;
    postalCode: string;
    country: string;
} 