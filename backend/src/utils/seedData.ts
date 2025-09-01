// 🌱 Seed Data for Testing Menu API

export const sampleProducts = [
  {
    name: "Klasik Döner",
    description: "Geleneksel lezzetleriyle hazırlanan, taze malzemelerle yapılmış enfes döner. Özel baharatlarımızla marine edilmiş tavuk eti, taze sebzeler ve özel soslarımızla servis edilir.",
    shortDescription: "Taze sebzeler ve özel soslarla hazırlanan lezzetli döner",
    categoryId: "507f1f77bcf86cd799439011", // Placeholder category ID
    price: 45.00,
    originalPrice: 50.00,
    discountPercentage: 10,
    images: [
      {
        url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop",
        alt: "Klasik Döner",
        isMain: true,
        sortOrder: 1
      }
    ],
    ingredients: [
      "Tavuk eti",
      "Lavash ekmeği", 
      "Domates",
      "Marul",
      "Soğan",
      "Özel sos"
    ],
    allergens: ["gluten"],
    nutritionalInfo: {
      calories: 520,
      protein: 35,
      carbohydrates: 45,
      fat: 22,
      servingSize: "1 porsiyon"
    },
    preparationTime: 8,
    difficulty: "easy",
    spiceLevel: 1,
    portions: [
      {
        name: "Yarım",
        description: "Tek kişilik porsiyon",
        priceModifier: -10,
        isDefault: false,
        sortOrder: 1
      },
      {
        name: "Tam",
        description: "Normal porsiyon", 
        priceModifier: 0,
        isDefault: true,
        sortOrder: 2
      },
      {
        name: "Büyük",
        description: "Büyük porsiyon",
        priceModifier: 15,
        isDefault: false,
        sortOrder: 3
      }
    ],
    customizations: [
      {
        type: "addon",
        name: "Ek Malzemeler",
        description: "Dönerinize ekstra malzeme ekleyin",
        isRequired: false,
        allowMultiple: true,
        maxSelections: 5,
        sortOrder: 1,
        options: [
          {
            name: "Ekstra Et",
            description: "25% fazla et",
            priceModifier: 8,
            isDefault: false,
            isAvailable: true,
            sortOrder: 1
          },
          {
            name: "Ekstra Sebze",
            description: "Taze sebze çeşitleri",
            priceModifier: 3,
            isDefault: false,
            isAvailable: true,
            sortOrder: 2
          },
          {
            name: "Peynir",
            description: "Kaşar peyniri",
            priceModifier: 5,
            isDefault: false,
            isAvailable: true,
            sortOrder: 3
          }
        ]
      },
      {
        type: "option",
        name: "Acılık Seviyesi",
        description: "Dönerinizin acılık seviyesini seçin",
        isRequired: true,
        allowMultiple: false,
        sortOrder: 2,
        options: [
          {
            name: "Az Acı",
            priceModifier: 0,
            isDefault: true,
            isAvailable: true,
            sortOrder: 1
          },
          {
            name: "Orta Acı",
            priceModifier: 0,
            isDefault: false,
            isAvailable: true,
            sortOrder: 2
          },
          {
            name: "Çok Acı",
            priceModifier: 0,
            isDefault: false,
            isAvailable: true,
            sortOrder: 3
          }
        ]
      }
    ],
    tags: ["döner", "tavuk", "geleneksel", "hızlı"],
    seoKeywords: ["döner", "tavuk döner", "lezzet durağı", "mersin döner"],
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    isNew: false,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    availableHours: {
      start: "10:00",
      end: "23:00",
      days: [1, 2, 3, 4, 5, 6, 7]
    },
    createdBy: "507f1f77bcf86cd799439011" // Placeholder user ID
  },
  
  {
    name: "İtalyan Makarna",
    description: "İtalya'nın geleneksel lezzetlerinden ilham alınarak hazırlanan enfes makarna. Taze domates sosu, aromatic baharatlar ve parmesan peyniri ile servis edilir.",
    shortDescription: "Taze domates sosu ve parmesan peyniri ile",
    categoryId: "507f1f77bcf86cd799439012", // Placeholder category ID
    price: 35.00,
    images: [
      {
        url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop",
        alt: "İtalyan Makarna",
        isMain: true,
        sortOrder: 1
      }
    ],
    ingredients: [
      "Spagetti makarna",
      "Domates sosu",
      "Parmesan peyniri",
      "Taze fesleğen",
      "Sarımsak",
      "Zeytinyağı"
    ],
    allergens: ["gluten", "dairy"],
    nutritionalInfo: {
      calories: 420,
      protein: 18,
      carbohydrates: 65,
      fat: 12,
      servingSize: "1 porsiyon"
    },
    preparationTime: 12,
    difficulty: "medium",
    spiceLevel: 0,
    portions: [
      {
        name: "Küçük",
        description: "Hafif porsiyon",
        priceModifier: -8,
        isDefault: false,
        sortOrder: 1
      },
      {
        name: "Normal",
        description: "Standart porsiyon",
        priceModifier: 0,
        isDefault: true,
        sortOrder: 2
      },
      {
        name: "Büyük",
        description: "Büyük porsiyon",
        priceModifier: 12,
        isDefault: false,
        sortOrder: 3
      }
    ],
    customizations: [
      {
        type: "option",
        name: "Makarna Tipi",
        description: "Makarna tipini seçin",
        isRequired: true,
        allowMultiple: false,
        sortOrder: 1,
        options: [
          {
            name: "Spagetti",
            priceModifier: 0,
            isDefault: true,
            isAvailable: true,
            sortOrder: 1
          },
          {
            name: "Penne",
            priceModifier: 0,
            isDefault: false,
            isAvailable: true,
            sortOrder: 2
          },
          {
            name: "Fettuccine",
            priceModifier: 2,
            isDefault: false,
            isAvailable: true,
            sortOrder: 3
          }
        ]
      }
    ],
    tags: ["makarna", "italyan", "vegan-option", "hızlı"],
    seoKeywords: ["makarna", "italyan makarna", "spagetti", "domates soslu"],
    isAvailable: true,
    isPopular: true,
    isFeatured: false,
    isNew: true,
    minOrderQuantity: 1,
    maxOrderQuantity: 3,
    createdBy: "507f1f77bcf86cd799439011"
  },

  {
    name: "Sezar Salata",
    description: "Taze marul yaprakları, kruton, parmesan peyniri ve özel sezar sosumuz ile hazırlanan nefis salata. Sağlıklı ve doyurucu bir seçenek.",
    shortDescription: "Taze marul, kruton ve parmesan ile",
    categoryId: "507f1f77bcf86cd799439013", // Placeholder category ID  
    price: 28.00,
    images: [
      {
        url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
        alt: "Sezar Salata",
        isMain: true,
        sortOrder: 1
      }
    ],
    ingredients: [
      "Taze marul",
      "Kruton",
      "Parmesan peyniri",
      "Sezar sos",
      "Limon",
      "Zeytinyağı"
    ],
    allergens: ["gluten", "dairy"],
    nutritionalInfo: {
      calories: 280,
      protein: 12,
      carbohydrates: 18,
      fat: 20,
      fiber: 5,
      servingSize: "1 porsiyon"
    },
    preparationTime: 5,
    difficulty: "easy",
    spiceLevel: 0,
    portions: [
      {
        name: "Küçük",
        description: "Yan salata",
        priceModifier: -10,
        isDefault: false,
        sortOrder: 1
      },
      {
        name: "Büyük",
        description: "Ana yemek salata",
        priceModifier: 0,
        isDefault: true,
        sortOrder: 2
      }
    ],
    customizations: [
      {
        type: "addon",
        name: "Protein Eklentileri",
        description: "Salatanıza protein ekleyin",
        isRequired: false,
        allowMultiple: false,
        sortOrder: 1,
        options: [
          {
            name: "Tavuk Göğsü",
            description: "Izgara tavuk göğsü",
            priceModifier: 15,
            isDefault: false,
            isAvailable: true,
            sortOrder: 1
          },
          {
            name: "Karides",
            description: "Taze karides",
            priceModifier: 25,
            isDefault: false,
            isAvailable: true,
            sortOrder: 2
          }
        ]
      }
    ],
    tags: ["salata", "sağlıklı", "vegetarian", "hızlı"],
    seoKeywords: ["sezar salata", "salata", "sağlıklı", "marul"],
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    isNew: false,
    minOrderQuantity: 1,
    maxOrderQuantity: 2,
    availableHours: {
      start: "09:00",
      end: "22:00", 
      days: [1, 2, 3, 4, 5, 6, 7]
    },
    createdBy: "507f1f77bcf86cd799439011"
  }
];

// 🧪 API Test Function
export const testMenuAPI = async (): Promise<void> => {
  const baseURL = 'http://localhost:5000/api/menu';
  
  try {
    console.log('🧪 Menu API Testleri Başlatılıyor...\n');
    
    // Test 1: Health Check
    console.log('1️⃣ Health Check Test...');
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);
    
    // Test 2: Get All Products (Empty)
    console.log('\n2️⃣ Get All Products Test (Empty)...');
    const productsResponse = await fetch(`${baseURL}/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products Retrieved:', productsData.data?.length || 0, 'items');
    
    // Test 3: Create Sample Products
    console.log('\n3️⃣ Creating Sample Products...');
    for (const [index, product] of sampleProducts.entries()) {
      try {
        const createResponse = await fetch(`${baseURL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        });
        
        if (createResponse.ok) {
          const createdProduct = await createResponse.json();
          console.log(`✅ Product ${index + 1} created:`, createdProduct.data?.name);
        } else {
          const errorData = await createResponse.json();
          console.log(`❌ Product ${index + 1} failed:`, errorData.message);
        }
      } catch (error) {
        console.log(`❌ Product ${index + 1} error:`, error);
      }
    }
    
    // Test 4: Get All Products (With Data)
    console.log('\n4️⃣ Get All Products Test (With Data)...');
    const productsResponse2 = await fetch(`${baseURL}/products`);
    const productsData2 = await productsResponse2.json();
    console.log('✅ Products Retrieved:', productsData2.data?.length || 0, 'items');
    
    // Test 5: Search Test
    console.log('\n5️⃣ Search Test...');
    const searchResponse = await fetch(`${baseURL}/products/search?query=döner`);
    const searchData = await searchResponse.json();
    console.log('✅ Search Results:', searchData.data?.length || 0, 'items');
    
    // Test 6: Featured Products
    console.log('\n6️⃣ Featured Products Test...');
    const featuredResponse = await fetch(`${baseURL}/products/featured`);
    const featuredData = await featuredResponse.json();
    console.log('✅ Featured Products:', featuredData.data?.length || 0, 'items');
    
    console.log('\n🎉 Tüm testler tamamlandı!');
    
  } catch (error) {
    console.error('❌ Test Error:', error);
  }
};

// 🚀 Run tests if this file is executed directly
if (require.main === module) {
  // Wait a bit for server to start
  setTimeout(testMenuAPI, 2000);
}
