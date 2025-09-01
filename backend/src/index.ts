import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

// Environment variables'ı yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();
const PORT = process.env.PORT || 5000;

// 🔒 Security middleware
app.use(helmet());

// 🌐 CORS - Frontend ile backend arasındaki iletişim için
app.use(cors({
  origin: [
    'http://localhost:5173',  // Development frontend
    'http://localhost:5174',  // Development frontend (backup)
    'https://lezzet-duragi.vercel.app'  // Production frontend
  ],
  credentials: true
}));

// 📦 JSON parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🏥 Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Lezzet Durağı Backend Server Çalışıyor!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 🚀 Ana route
app.get('/', (req, res) => {
  res.json({
    message: '🍽️ Lezzet Durağı API Server',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/health'
  });
});

// 🗄️ Import models to ensure they're registered
import './models';

// 📱 API Routes - Buraya ileride auth, menu, order route'larını ekleyeceğiz
// app.use('/api/auth', authRoutes);
// app.use('/api/menu', menuRoutes);
// app.use('/api/orders', orderRoutes);

// 🔥 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route bulunamadı',
    message: `${req.method} ${req.originalUrl} endpoint'i mevcut değil`
  });
});

// 🚨 Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', error);

  res.status(error.status || 500).json({
    error: 'Sunucu hatası',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Bir hata oluştu',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 🔌 Server'ı başlat
const startServer = async () => {
  try {
    // 📊 MongoDB'ye bağlan (opsiyonel)
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('⚠️ MongoDB bağlantısı başarısız, sunucu MongoDB olmadan çalışacak');
      console.warn('💡 Local MongoDB kurulumu için: https://docs.mongodb.com/manual/installation/');
    }

    // 🎧 Server'ı dinlemeye başla
    app.listen(PORT, () => {
      console.log(`
🚀 ================================
🍽️  Lezzet Durağı Backend Server
🚀 ================================
🌍 Server URL: http://localhost:${PORT}
🏥 Health Check: http://localhost:${PORT}/health
📊 Environment: ${process.env.NODE_ENV || 'development'}
⏰ Started at: ${new Date().toLocaleString('tr-TR')}
🚀 ================================
      `);
    });

  } catch (error) {
    console.error('❌ Server başlatma hatası:', error);
    process.exit(1);
  }
};

// 🎬 Server'ı başlat
startServer();

export default app;
