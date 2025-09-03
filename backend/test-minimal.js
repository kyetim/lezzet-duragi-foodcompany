// 🔥 MINIMAL TEST SERVER - KESINLIKLE ÇALIŞACAK!

const http = require('http');

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    res.setHeader('Content-Type', 'application/json');

    // Routes
    if (req.url === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'OK',
            message: '🎉 Backend Server Çalışıyor!',
            timestamp: new Date().toISOString(),
            port: 5000
        }));
    }
    else if (req.url === '/api/menu/products') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            message: 'Products endpoint çalışıyor',
            data: {
                products: [
                    { id: '1', name: 'Test Döner', price: 45 },
                    { id: '2', name: 'Test Makarna', price: 35 }
                ],
                total: 2
            }
        }));
    }
    else if (req.url === '/api/menu/categories') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: ['doner', 'makarna', 'icecek']
        }));
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({
            success: false,
            message: 'Endpoint bulunamadı',
            availableEndpoints: ['/health', '/api/menu/products', '/api/menu/categories']
        }));
    }
});

const PORT = 5000;

server.listen(PORT, (err) => {
    if (err) {
        console.error('❌ Server başlatılamadı:', err);
        process.exit(1);
    }

    console.log('🚀 BACKEND SERVER BAŞLADI!');
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
    console.log(`📱 API Base: http://localhost:${PORT}/api`);
    console.log('⏰ Server time:', new Date().toISOString());
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server kapatılıyor...');
    server.close(() => {
        console.log('✅ Server başarıyla kapatıldı');
        process.exit(0);
    });
});

// Error handling
server.on('error', (err) => {
    console.error('❌ Server hatası:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} zaten kullanımda!`);
        process.exit(1);
    }
});

console.log('🔥 Backend server başlatılıyor...');
