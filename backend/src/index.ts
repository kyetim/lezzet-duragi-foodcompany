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

// 📱 Import routes
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orderRoutes';

// 🔧 Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { sanitizeInput } from './middleware/validation';

// 🧹 Global middleware
app.use(sanitizeInput);

// 📱 API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// 📱 API Routes - Buraya ileride diğer route'ları ekleyeceğiz
// app.use('/api/auth', authRoutes);

// 🔥 404 handler - Must come after all routes
app.use(notFoundHandler);

// 🚨 Global Error handler - Must be last
app.use(errorHandler);

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
