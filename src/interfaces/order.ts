export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    deliveryType: 'pickup' | 'delivery';
    deliveryAddress?: Address;
    deliveryAddressId?: string;
    createdAt: Date;
    updatedAt?: Date;
    estimatedDeliveryTime?: Date;
    notes?: string;
    orderNumber: string;
    paymentMethod: PaymentMethod;
}

export interface OrderItem {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
    image?: string;
    size?: string;
}

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'on-delivery'
    | 'delivered'
    | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'online';

export interface Address {
    street: string;
    city: string;
    postalCode: string;
    country: string;
} 