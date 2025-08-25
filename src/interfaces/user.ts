export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    address?: Address;
    createdAt: Date;
    isAdmin: boolean;
}

export interface Address {
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface UserAddress {
    id: string;
    title: string; // "Ev", "İş", "Diğer"
    fullName: string;
    phone: string;
    address: string;
    district: string;
    city: string;
    postalCode?: string;
    isDefault: boolean;
    createdAt: Date;
    // CheckoutPage ile uyumluluk için eklenen alan
    fullAddress?: string;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    phoneNumber?: string;
    photoURL?: string;
    addresses: UserAddress[];
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
    phone?: string;
}

// Explicit export to ensure UserAddress is available 