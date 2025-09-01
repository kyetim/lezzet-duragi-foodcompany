import mongoose from 'mongoose';

// 🔗 MongoDB bağlantı fonksiyonu
export const connectDB = async (): Promise<void> => {
  try {
    // MongoDB URI'yi environment variable'dan al
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lezzet-duragi';
    
    console.log('📊 MongoDB bağlantısı kuruluyor...');
    
    // MongoDB'ye bağlan
    const connection = await mongoose.connect(mongoURI, {
      // Modern MongoDB driver seçenekleri
      serverSelectionTimeoutMS: 5000, // 5 saniye timeout
      // authSource: 'admin', // Eğer authentication gerekiyorsa
    });
    
    console.log(`✅ MongoDB bağlantısı başarılı!`);
    console.log(`📍 Database: ${connection.connection.name}`);
    console.log(`🌍 Host: ${connection.connection.host}:${connection.connection.port}`);
    
    // Bağlantı olaylarını dinle
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB bağlantı hatası:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB bağlantısı kesildi');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB yeniden bağlandı');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🔌 MongoDB bağlantısı kapatılıyor...');
      await mongoose.connection.close();
      console.log('✅ MongoDB bağlantısı kapatıldı');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    throw error;
  }
};

// 🔌 MongoDB bağlantısını kapat
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB bağlantısı kapatıldı');
  } catch (error) {
    console.error('❌ MongoDB bağlantısı kapatma hatası:', error);
  }
};

// 📊 Database durumunu kontrol et
export const getDatabaseStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    status: states[state as keyof typeof states] || 'unknown',
    name: mongoose.connection.name,
    host: mongoose.connection.host,
    port: mongoose.connection.port
  };
};
