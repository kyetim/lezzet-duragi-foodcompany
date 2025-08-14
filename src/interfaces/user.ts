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

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
    phone?: string;
} 