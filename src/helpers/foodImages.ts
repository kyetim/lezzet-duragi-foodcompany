// Gerçek yemek görselleri için Unsplash API entegrasyonu
export interface FoodImage {
    id: string;
    url: string;
    alt: string;
    category: string;
}

// Unsplash API'den yemek görselleri
const UNSPLASH_API_KEY = 'YOUR_UNSPLASH_API_KEY'; // Gerçek projede environment variable kullanın

// Fallback görseller (Unsplash API olmadan da çalışır)
export const foodImages: FoodImage[] = [
    // Döner Kategorisi
    {
        id: 'doner-1',
        url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop',
        alt: 'Taze Döner',
        category: 'doner'
    },
    {
        id: 'doner-2',
        url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop',
        alt: 'Döner Porsiyon',
        category: 'doner'
    },
    {
        id: 'doner-3',
        url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
        alt: 'Döner Sandviç',
        category: 'doner'
    },

    // Makarna Kategorisi
    {
        id: 'makarna-1',
        url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop',
        alt: 'İtalyan Makarna',
        category: 'makarna'
    },
    {
        id: 'makarna-2',
        url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop',
        alt: 'Spaghetti Carbonara',
        category: 'makarna'
    },
    {
        id: 'makarna-3',
        url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
        alt: 'Penne Arrabbiata',
        category: 'makarna'
    },

    // Salata Kategorisi
    {
        id: 'salata-1',
        url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
        alt: 'Taze Salata',
        category: 'salata'
    },
    {
        id: 'salata-2',
        url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop',
        alt: 'Sezar Salata',
        category: 'salata'
    },
    {
        id: 'salata-3',
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
        alt: 'Mevsim Salata',
        category: 'salata'
    },

    // İçecek Kategorisi
    {
        id: 'icecek-1',
        url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
        alt: 'Taze Meyve Suyu',
        category: 'icecek'
    },
    {
        id: 'icecek-2',
        url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&h=600&fit=crop',
        alt: 'Smoothie',
        category: 'icecek'
    },
    {
        id: 'icecek-3',
        url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
        alt: 'Ayran',
        category: 'icecek'
    },

    // Hero Section için özel görseller
    {
        id: 'hero-doner',
        url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1200&h=800&fit=crop',
        alt: 'Premium Döner',
        category: 'hero'
    },
    {
        id: 'hero-makarna',
        url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1200&h=800&fit=crop',
        alt: 'İtalyan Makarna',
        category: 'hero'
    },

    // About Section için
    {
        id: 'about-food',
        url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop',
        alt: 'Lezzetli Yemekler',
        category: 'about'
    },

    // Special Deal için
    {
        id: 'special-deal',
        url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
        alt: 'Özel Menü',
        category: 'special'
    }
];

// Kategoriye göre görsel getirme
export const getFoodImagesByCategory = (category: string): FoodImage[] => {
    return foodImages.filter(img => img.category === category);
};

// Rastgele görsel getirme
export const getRandomFoodImage = (category?: string): FoodImage => {
    const filteredImages = category
        ? foodImages.filter(img => img.category === category)
        : foodImages;

    const randomIndex = Math.floor(Math.random() * filteredImages.length);
    return filteredImages[randomIndex];
};

// Hero section için özel görsel
export const getHeroImage = (): FoodImage => {
    const heroImages = foodImages.filter(img => img.category === 'hero');
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    return heroImages[randomIndex];
};

// Unsplash API'den dinamik görsel çekme (opsiyonel)
export const fetchFoodImageFromUnsplash = async (query: string): Promise<string> => {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${UNSPLASH_API_KEY}`
        );
        const data = await response.json();
        return data.urls.regular;
    } catch (error) {
        console.error('Unsplash API error:', error);
        // Fallback görsel döndür
        return getRandomFoodImage().url;
    }
};

// Görsel optimizasyonu için URL parametreleri
export const optimizeImageUrl = (url: string, width: number = 800, height: number = 600): string => {
    if (url.includes('unsplash.com')) {
        return `${url}?w=${width}&h=${height}&fit=crop&q=80`;
    }
    return url;
};
