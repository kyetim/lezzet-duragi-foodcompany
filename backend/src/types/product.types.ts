import { Document, Types } from 'mongoose';

// 🍽️ Product Base Interface
export interface IProduct {
    name: string;
    slug: string; // URL-friendly name
    description: string;
    shortDescription?: string;
    category: IProductCategory;
    subCategory?: string;

    // 💰 Pricing
    price: number;
    originalPrice?: number; // İndirim varsa orijinal fiyat
    discountPercentage?: number;
    currency: 'TRY' | 'USD' | 'EUR';

    // 🖼️ Media
    images: IProductImage[];
    thumbnail?: string;

    // 📊 Product Details
    ingredients: string[];
    allergens: string[]; // ['gluten', 'dairy', 'nuts', 'eggs']
    nutritionalInfo?: INutritionalInfo;
    preparationTime: number; // dakika
    difficulty: 'easy' | 'medium' | 'hard';
    spiceLevel: 0 | 1 | 2 | 3; // 0: Baharatsız, 3: Çok acı

    // 📏 Portion & Sizes
    portions: IProductPortion[];
    customizations: IProductCustomization[];

    // 🏷️ Tags & SEO
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords: string[];

    // 📊 Stats & Availability
    isAvailable: boolean;
    isPopular: boolean;
    isFeatured: boolean;
    isNew: boolean;
    viewCount: number;
    orderCount: number;
    rating: {
        average: number;
        count: number;
        distribution: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    };

    // 🎯 Business Rules
    minOrderQuantity: number;
    maxOrderQuantity?: number;
    stockQuantity?: number; // null = sınırsız
    isStockTracked: boolean;

    // ⏰ Availability Schedule
    availableHours?: {
        start: string; // '09:00'
        end: string;   // '22:00'
        days: number[]; // [1,2,3,4,5,6,7] // Pazartesi=1, Pazar=7
    };

    // 📈 Business Metrics
    cost?: number; // İç maliyet (admin only)
    profitMargin?: number;

    isActive: boolean;
    createdBy: Types.ObjectId; // Admin/Manager
    createdAt: Date;
    updatedAt: Date;
}

// 🏷️ Product Category Interface
export interface IProductCategory {
    _id?: Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    image?: string;
    color?: string;
    sortOrder: number;
    isActive: boolean;
    seoTitle?: string;
    seoDescription?: string;
    parent?: Types.ObjectId; // Alt kategori için
    children?: Types.ObjectId[]; // Ana kategori için
}

// 🖼️ Product Image Interface
export interface IProductImage {
    _id?: Types.ObjectId;
    url: string;
    alt: string;
    title?: string;
    size?: {
        width: number;
        height: number;
    };
    sortOrder: number;
    isMain: boolean;
}

// 🥗 Nutritional Information
export interface INutritionalInfo {
    calories: number;
    protein: number; // gram
    carbohydrates: number; // gram
    fat: number; // gram
    fiber?: number; // gram
    sugar?: number; // gram
    sodium?: number; // mg
    servingSize: string; // '100g', '1 porsiyon'
}

// 🍽️ Product Portion/Size Interface
export interface IProductPortion {
    _id?: Types.ObjectId;
    name: string; // 'Küçük', 'Orta', 'Büyük', 'Yarım', 'Tam'
    description?: string;
    priceModifier: number; // 0 = aynı fiyat, 5 = +5 TL, -3 = -3 TL
    isDefault: boolean;
    sortOrder: number;
}

// 🔧 Product Customization Interface
export interface IProductCustomization {
    _id?: Types.ObjectId;
    type: 'addon' | 'option' | 'ingredient'; // Eklenti | Seçenek | Malzeme
    name: string;
    description?: string;
    options: ICustomizationOption[];
    isRequired: boolean;
    allowMultiple: boolean;
    maxSelections?: number;
    sortOrder: number;
}

// ⚙️ Customization Option Interface
export interface ICustomizationOption {
    _id?: Types.ObjectId;
    name: string;
    description?: string;
    priceModifier: number;
    isDefault: boolean;
    isAvailable: boolean;
    sortOrder: number;
}

// 📊 Product Analytics Interface
export interface IProductAnalytics {
    views: {
        total: number;
        daily: { date: Date; count: number }[];
        monthly: { month: string; count: number }[];
    };
    orders: {
        total: number;
        revenue: number;
        averageRating: number;
    };
    performance: {
        conversionRate: number; // View'dan order'a dönüşüm
        popularTimes: string[]; // En çok sipariş edilen saatler
        seasonality: { season: string; orderCount: number }[];
    };
}

// 🌟 Combined Product Document Interface (Mongoose Document)
export interface IProductDocument extends IProduct, Document {
    _id: Types.ObjectId;

    // 🔧 Instance Methods
    calculateDiscountedPrice(): number;
    getAvailablePortions(): IProductPortion[];
    isAvailableNow(): boolean;
    incrementViewCount(): Promise<void>;
    updateRating(newRating: number): Promise<void>;

    // 📊 Analytics methods
    getAnalytics(period?: 'day' | 'week' | 'month'): Promise<IProductAnalytics>;
    getPopularCustomizations(): Promise<ICustomizationOption[]>;
}

// 🔍 Product Query Helpers
export interface IProductQuery {
    findByCategory(categoryId: Types.ObjectId): Promise<IProductDocument[]>;
    findPopular(limit?: number): Promise<IProductDocument[]>;
    findFeatured(): Promise<IProductDocument[]>;
    searchByName(searchTerm: string): Promise<IProductDocument[]>;
    findAvailable(): Promise<IProductDocument[]>;
    findBestSellers(): Promise<IProductDocument[]>;
}

// 🆕 Product Creation Interface
export interface IProductCreateInput {
    name: string;
    description: string;
    shortDescription?: string;
    categoryId: Types.ObjectId;
    price: number;
    images?: Omit<IProductImage, '_id'>[];
    ingredients: string[];
    allergens?: string[];
    preparationTime: number;
    portions?: Omit<IProductPortion, '_id'>[];
    customizations?: Omit<IProductCustomization, '_id'>[];
    tags?: string[];
    nutritionalInfo?: INutritionalInfo;
}

// ✏️ Product Update Interface
export interface IProductUpdateInput {
    name?: string;
    description?: string;
    shortDescription?: string;
    price?: number;
    originalPrice?: number;
    isAvailable?: boolean;
    isPopular?: boolean;
    isFeatured?: boolean;
    ingredients?: string[];
    allergens?: string[];
    preparationTime?: number;
    tags?: string[];
}

// 🔍 Product Search/Filter Interface
export interface IProductSearchFilters {
    category?: Types.ObjectId | string;
    priceRange?: {
        min?: number;
        max?: number;
    };
    tags?: string[];
    allergens?: string[]; // Exclude products with these allergens
    spiceLevel?: number[];
    preparationTime?: {
        max?: number; // Maksimum hazırlık süresi
    };
    rating?: {
        min?: number; // Minimum rating
    };
    availability?: boolean;
    search?: string; // Text search
}

// 📄 Product List Response Interface
export interface IProductListResponse {
    products: IProductDocument[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    filters: {
        appliedFilters: IProductSearchFilters;
        availableFilters: {
            categories: IProductCategory[];
            priceRange: { min: number; max: number };
            maxPreparationTime: number;
            availableTags: string[];
        };
    };
}
