import type { MenuItem } from '@/interfaces/menu-item';

export const menuData: MenuItem[] = [
    // Döner Kategorisi
    {
        id: '1',
        name: 'Tavuk Döner',
        description: 'Özel soslu, taze tavuk eti ile hazırlanan geleneksel döner',
        price: 45,
        category: 'doner',
        imageWebp: '/images/tavuk-doner.webp',
        isAvailable: true,
        ingredients: ['Tavuk eti', 'Marul', 'Domates', 'Soğan', 'Özel sos'],
        preparationTime: 8
    },
    {
        id: '2',
        name: 'Et Döner',
        description: 'Dana eti ile hazırlanan, geleneksel tarifli döner',
        price: 55,
        category: 'doner',
        imageWebp: '/images/et-doner.webp',
        isAvailable: true,
        ingredients: ['Dana eti', 'Marul', 'Domates', 'Soğan', 'Özel sos'],
        preparationTime: 10
    },
    {
        id: '3',
        name: 'Karışık Döner',
        description: 'Tavuk ve et karışımı ile hazırlanan özel döner',
        price: 50,
        category: 'doner',
        imageWebp: '/images/karisik-doner.webp',
        isAvailable: true,
        ingredients: ['Tavuk eti', 'Dana eti', 'Marul', 'Domates', 'Soğan'],
        preparationTime: 9
    },
    {
        id: '13',
        name: 'Pilav Üstü Döner',
        description: 'Tereyağlı pilav üzerinde bol döner eti',
        price: 60,
        category: 'doner',
        imageWebp: '/images/pilav-ustu-doner.webp',
        isAvailable: true,
        ingredients: ['Pilav', 'Döner eti', 'Tereyağı', 'Domates'],
        preparationTime: 12
    },
    {
        id: '14',
        name: 'Dürüm Döner',
        description: 'Lavaş ekmeğinde bol malzemeli döner',
        price: 48,
        category: 'doner',
        imageWebp: '/images/durum-doner.webp',
        isAvailable: true,
        ingredients: ['Lavaş', 'Döner eti', 'Marul', 'Domates', 'Soğan'],
        preparationTime: 7
    },
    {
        id: '15',
        name: 'Kaşarlı Döner',
        description: 'Dönerin en lezzetli hali, eriyen kaşar ile',
        price: 52,
        category: 'doner',
        imageWebp: '/images/kasarli-doner.webp',
        isAvailable: true,
        ingredients: ['Döner eti', 'Kaşar', 'Domates', 'Marul'],
        preparationTime: 9
    },

    // Makarna Kategorisi
    {
        id: '4',
        name: 'Carbonara Makarna',
        description: 'Kremalı sos, parmesan peyniri ve pastırma ile',
        price: 55,
        category: 'makarna',
        imageWebp: '/images/carbonara.webp',
        isAvailable: true,
        ingredients: ['Makarna', 'Krema', 'Parmesan', 'Pastırma', 'Yumurta'],
        preparationTime: 15
    },
    {
        id: '5',
        name: 'Bolognese Makarna',
        description: 'Domates soslu, kıyma ile hazırlanan klasik makarna',
        price: 50,
        category: 'makarna',
        imageWebp: '/images/bolognese.webp',
        isAvailable: true,
        ingredients: ['Makarna', 'Domates sosu', 'Kıyma', 'Soğan', 'Sarımsak'],
        preparationTime: 12
    },
    {
        id: '6',
        name: 'Pesto Makarna',
        description: 'Fesleğen soslu, çam fıstığı ile hazırlanan makarna',
        price: 48,
        category: 'makarna',
        imageWebp: '/images/pesto.webp',
        isAvailable: true,
        ingredients: ['Makarna', 'Fesleğen', 'Çam fıstığı', 'Parmesan', 'Zeytinyağı'],
        preparationTime: 10
    },
    {
        id: '16',
        name: 'Napoliten Makarna',
        description: 'Domates soslu, zeytinli ve fesleğenli makarna',
        price: 46,
        category: 'makarna',
        imageWebp: '/images/napoliten.webp',
        isAvailable: true,
        ingredients: ['Makarna', 'Domates', 'Zeytin', 'Fesleğen'],
        preparationTime: 11
    },
    {
        id: '17',
        name: 'Mantarlı Kremalı Makarna',
        description: 'Taze mantar ve krema ile hazırlanan makarna',
        price: 52,
        category: 'makarna',
        imageWebp: '/images/mantarli-makarna.webp',
        isAvailable: true,
        ingredients: ['Makarna', 'Mantar', 'Krema', 'Peynir'],
        preparationTime: 13
    },
    {
        id: '18',
        name: 'Penne Arrabbiata',
        description: 'Acılı domates soslu penne makarna',
        price: 49,
        category: 'makarna',
        imageWebp: '/images/arrabbiata.webp',
        isAvailable: true,
        ingredients: ['Penne', 'Domates', 'Biber', 'Sarımsak'],
        preparationTime: 12
    },

    // Salata Kategorisi
    {
        id: '7',
        name: 'Sezar Salata',
        description: 'Marul, tavuk, parmesan ve özel sezar sosu ile',
        price: 35,
        category: 'salata',
        imageWebp: '/images/sezar-salata.webp',
        isAvailable: true,
        ingredients: ['Marul', 'Tavuk', 'Parmesan', 'Kruton', 'Sezar sosu'],
        preparationTime: 8
    },
    {
        id: '8',
        name: 'Çoban Salata',
        description: 'Taze sebzelerle hazırlanan geleneksel çoban salata',
        price: 25,
        category: 'salata',
        imageWebp: '/images/coban-salata.webp',
        isAvailable: true,
        ingredients: ['Domates', 'Salatalık', 'Soğan', 'Beyaz peynir', 'Zeytin'],
        preparationTime: 5
    },
    {
        id: '9',
        name: 'Gökkuşağı Salata',
        description: 'Renkli sebzelerle hazırlanan sağlıklı salata',
        price: 30,
        category: 'salata',
        imageWebp: '/images/gokkusagi-salata.webp',
        isAvailable: true,
        ingredients: ['Havuç', 'Mısır', 'Bezelye', 'Domates', 'Salatalık'],
        preparationTime: 7
    },
    {
        id: '19',
        name: 'Akdeniz Salata',
        description: 'Zeytinyağlı, peynirli ve yeşillikli Akdeniz salatası',
        price: 32,
        category: 'salata',
        imageWebp: '/images/akdeniz-salata.webp',
        isAvailable: true,
        ingredients: ['Yeşillik', 'Beyaz peynir', 'Zeytin', 'Domates'],
        preparationTime: 6
    },
    {
        id: '20',
        name: 'Ton Balıklı Salata',
        description: 'Ton balığı, mısır ve yeşilliklerle hazırlanan salata',
        price: 38,
        category: 'salata',
        imageWebp: '/images/tonbalikli-salata.webp',
        isAvailable: true,
        ingredients: ['Ton balığı', 'Mısır', 'Yeşillik', 'Domates'],
        preparationTime: 8
    },
    {
        id: '21',
        name: 'Kinoalı Salata',
        description: 'Kinoa, avokado ve taze sebzelerle sağlıklı salata',
        price: 36,
        category: 'salata',
        imageWebp: '/images/kinoali-salata.webp',
        isAvailable: true,
        ingredients: ['Kinoa', 'Avokado', 'Domates', 'Salatalık'],
        preparationTime: 9
    },

    // İçecek Kategorisi
    {
        id: '10',
        name: 'Ayran',
        description: 'Taze, soğuk ayran',
        price: 8,
        category: 'icecek',
        imageWebp: '/images/ayran.webp',
        isAvailable: true,
        ingredients: ['Yoğurt', 'Su', 'Tuz'],
        preparationTime: 1
    },
    {
        id: '11',
        name: 'Limonata',
        description: 'Taze sıkılmış limon suyu ile hazırlanan limonata',
        price: 12,
        category: 'icecek',
        imageWebp: '/images/limonata.webp',
        isAvailable: true,
        ingredients: ['Limon', 'Şeker', 'Su', 'Nane'],
        preparationTime: 3
    },
    {
        id: '12',
        name: 'Çay',
        description: 'Sıcak, demli çay',
        price: 5,
        category: 'icecek',
        imageWebp: '/images/cay.webp',
        isAvailable: true,
        ingredients: ['Çay', 'Su'],
        preparationTime: 2
    },
    {
        id: '22',
        name: 'Türk Kahvesi',
        description: 'Közde pişmiş geleneksel Türk kahvesi',
        price: 15,
        category: 'icecek',
        imageWebp: '/images/turk-kahvesi.webp',
        isAvailable: true,
        ingredients: ['Kahve', 'Su'],
        preparationTime: 4
    },
    {
        id: '23',
        name: 'Portakal Suyu',
        description: 'Taze sıkılmış portakal suyu',
        price: 14,
        category: 'icecek',
        imageWebp: '/images/portakal-suyu.webp',
        isAvailable: true,
        ingredients: ['Portakal'],
        preparationTime: 2
    },
    {
        id: '24',
        name: 'Soda',
        description: 'Doğal maden suyu',
        price: 7,
        category: 'icecek',
        imageWebp: '/images/soda.webp',
        isAvailable: true,
        ingredients: ['Maden suyu'],
        preparationTime: 1
    }
];

export const getMenuByCategory = (category: string): MenuItem[] => {
    return menuData.filter(item => item.category === category);
};

export const getFeaturedItems = (): MenuItem[] => {
    return menuData.slice(0, 6);
}; 