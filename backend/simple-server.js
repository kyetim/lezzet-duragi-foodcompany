// 🚀 Basit Çalışan Backend Server
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// 🏥 Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Lezzet Durağı Backend çalışıyor! 🚀',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// 📱 Ana endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🍽️ Lezzet Durağı API',
        version: '1.0.0',
        endpoints: [
            'GET /health - Health check',
            'GET /api/menu/products - Ürünler',
            'GET /api/orders - Siparişler'
        ]
    });
});

// 🍽️ Basit Menu API
app.get('/api/menu/products', (req, res) => {
    const products = [
        {
            id: 1,
            name: 'Adana Kebab',
            price: 85,
            description: 'Özel baharatlarla hazırlanmış nefis Adana kebabı',
            category: 'Ana Yemek',
            image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400'
        },
        {
            id: 2,
            name: 'Döner',
            price: 45,
            description: 'Tavuk döner, salata ve soslarla',
            category: 'Fast Food',
            image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400'
        },
        {
            id: 3,
            name: 'Pide',
            price: 55,
            description: 'Kaşarlı sucuklu pide',
            category: 'Pide',
            image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400'
        },
        {
            id: 4,
            name: 'Lahmacun',
            price: 25,
            description: 'Geleneksel lahmacun',
            category: 'Fast Food',
            image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400'
        }
    ];

    res.json({
        success: true,
        message: 'Ürünler başarıyla getirildi',
        data: products,
        total: products.length
    });
});

// 🛒 Basit Orders API
app.get('/api/orders', (req, res) => {
    const orders = [
        {
            id: 1,
            orderNumber: 'LD-2025-001',
            customer: 'Ahmet Yılmaz',
            items: [
                { productName: 'Adana Kebab', quantity: 1, price: 85 }
            ],
            total: 85,
            status: 'preparing',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            orderNumber: 'LD-2025-002',
            customer: 'Ayşe Demir',
            items: [
                { productName: 'Döner', quantity: 2, price: 45 },
                { productName: 'Lahmacun', quantity: 1, price: 25 }
            ],
            total: 115,
            status: 'ready',
            createdAt: new Date().toISOString()
        }
    ];

    res.json({
        success: true,
        message: 'Siparişler başarıyla getirildi',
        data: orders,
        total: orders.length
    });
});

// ➕ Sipariş oluşturma
app.post('/api/orders', (req, res) => {
    const { customer, items } = req.body;

    if (!customer || !items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Müşteri adı ve ürünler gereklidir'
        });
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = {
        id: Date.now(),
        orderNumber: `LD-2025-${String(Date.now()).slice(-3)}`,
        customer,
        items,
        total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    res.status(201).json({
        success: true,
        message: 'Sipariş başarıyla oluşturuldu',
        data: newOrder
    });
});

// 🔥 404 handler removed to avoid path-to-regexp issues

// 🚀 Server başlat
app.listen(PORT, () => {
    console.log(`
🚀 ================================
🍽️  Lezzet Durağı Backend Server
🚀 ================================
✅ Server çalışıyor: http://localhost:${PORT}
🏥 Health Check: http://localhost:${PORT}/health
📱 Menu API: http://localhost:${PORT}/api/menu/products
🛒 Orders API: http://localhost:${PORT}/api/orders
🌍 Environment: Simple JavaScript
⏰ Started at: ${new Date().toLocaleString('tr-TR')}
🚀 ================================
`);
});

// 🚨 Error handling
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
});
