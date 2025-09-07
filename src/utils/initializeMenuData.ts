import { menuFirebaseService, CreateMenuItemInput } from '../services/menuFirebaseService';

// Sample menu data for initialization
const sampleMenuItems: CreateMenuItemInput[] = [
  // Döner kategori
  {
    name: 'Tavuk Döner',
    description: 'Özel baharatlarla marine edilmiş tavuk döner, taze sebzeler ve özel soslarımızla',
    price: 45.00,
    category: 'doner',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400',
    isVegetarian: false,
    isAvailable: true,
    calories: 420,
    tags: ['popüler', 'tavuk', 'lezzetli'],
    preparationTime: 8,
    ingredients: ['tavuk eti', 'lavash', 'domates', 'salatalık', 'soğan', 'özel sos'],
    allergens: ['gluten']
  },
  {
    name: 'Et Döner',
    description: 'Dana etinden özel olarak hazırlanan geleneksel döner, pilav veya patates kızartması ile',
    price: 55.00,
    category: 'doner',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    isVegetarian: false,
    isAvailable: true,
    calories: 520,
    tags: ['premium', 'et', 'geleneksel'],
    preparationTime: 10,
    ingredients: ['dana eti', 'pide', 'domates', 'soğan', 'turşu', 'acı sos'],
    allergens: ['gluten']
  },
  {
    name: 'Bolonez Makarna',
    description: 'Ev yapımı bolonez soslu spagetti, taze parmesan peyniri ile',
    price: 35.00,
    category: 'makarna',
    image: 'https://images.unsplash.com/photo-1551892589-865f69869476?w=400',
    isVegetarian: false,
    isAvailable: true,
    calories: 380,
    tags: ['İtalyan', 'soslu', 'klasik'],
    preparationTime: 12,
    ingredients: ['spagetti', 'dana kıyma', 'domates sosu', 'parmesan', 'fesleğen'],
    allergens: ['gluten', 'süt ürünleri']
  },
  {
    name: 'Taze Sıkılmış Portakal Suyu',
    description: 'Günlük taze portakallardan sıkılmış doğal portakal suyu',
    price: 15.00,
    category: 'icecek',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
    isVegetarian: true,
    isAvailable: true,
    calories: 110,
    tags: ['taze', 'doğal', 'vitamin'],
    preparationTime: 3,
    ingredients: ['taze portakal'],
    allergens: []
  }
];

export const initializeMenuData = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing menu data...');
    
    // Check if menu already has items
    const existingItems = await menuFirebaseService.getAllMenuItems();
    
    if (existingItems.length > 0) {
      console.log('✅ Menu already has items, skipping initialization');
      return;
    }

    // Add sample menu items
    console.log(`📝 Adding ${sampleMenuItems.length} sample menu items...`);
    
    for (const item of sampleMenuItems) {
      await menuFirebaseService.createMenuItem(item);
      console.log(`✅ Added: ${item.name}`);
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('🎉 Menu data initialization completed!');
  } catch (error) {
    console.error('❌ Error initializing menu data:', error);
    throw error;
  }
};
