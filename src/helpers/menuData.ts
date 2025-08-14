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
    }
];

export const getMenuByCategory = (category: string): MenuItem[] => {
    return menuData.filter(item => item.category === category);
};

export const getFeaturedItems = (): MenuItem[] => {
    return menuData.filter(item => ['1', '4', '7'].includes(item.id));
}; 