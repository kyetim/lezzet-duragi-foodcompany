export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    subcategory?: string;
    image: string;
    imageWebp?: string; // backward compatibility
    isVegetarian?: boolean;
    isAvailable?: boolean;
    preparationTime?: number; // dakika cinsinden
    calories?: number;
    rating?: number;
    reviewCount?: number;
    tags?: string[];
    ingredients?: string[];
    allergens?: string[];
} 