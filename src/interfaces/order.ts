export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: 'pending' | 'paid' | 'failed';
    deliveryAddress: UserAddress;
    paymentMethod: string;
    notes?: string | null;
    createdAt: Date;
    updatedAt?: Date;
    estimatedDeliveryTime?: Date;
    orderNumber?: string;
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string | null;
    description?: string | null;
    specialInstructions?: string;
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

// UserAddress interface'ini import etmek yerine burada tanımlayalım
export interface UserAddress {
    id: string;
    title: string;
    fullAddress: string;
    phone: string;
    isDefault?: boolean;
    createdAt?: Date;
} 