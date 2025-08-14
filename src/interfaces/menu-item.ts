export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'doner' | 'makarna' | 'salata' | 'icecek';
    imageWebp: string;
    isAvailable: boolean;
    ingredients?: string[];
    allergens?: string[];
    preparationTime?: number; // dakika cinsinden
} 