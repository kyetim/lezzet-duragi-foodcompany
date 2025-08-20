import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, Truck, Award, Users, MapPin, Phone, Mail, Check, Sparkles, Zap, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { menuData, getMenuByCategory } from '@/helpers/menuData';
import { getHeroImage, getRandomFoodImage, optimizeImageUrl } from '@/helpers/foodImages';
import { ProductSlider } from '@/components/home/ProductSlider';
import { MenuList } from '@/components/menu/MenuList';

export function HomePage() {
  // Kategori filtreleme için state
  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'doner', name: 'Döner' },
    { id: 'makarna', name: 'Makarna' },
    { id: 'salata', name: 'Salata' },
    { id: 'icecek', name: 'İçecek' }
  ];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const filteredItems = selectedCategory === 'all'
    ? menuData.slice(0, 4)
    : getMenuByCategory(selectedCategory).slice(0, 4);

  // Gerçek yemek görselleri
  const heroImage = getHeroImage();
  const aboutImage = getRandomFoodImage('about');
  const specialDealImage = getRandomFoodImage('special');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  // --- Müşteri Yorumları Sliderı ---
  const allReviews = [
    {
      name: 'Ahmet Yılmaz',
      text: 'Lezzet Durağı’nda yediğim en lezzetli dönerdi! Taze malzemeler, hijyenik ortam ve hızlı servis. Kesinlikle tavsiye ederim.',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Zeynep Korkmaz',
      text: 'Fiyat/performans olarak çok iyi. Sıcak ve hızlı geldi.',
      rating: 4,
      img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Mehmet Ali',
      text: 'Makarnası harika, porsiyonlar doyurucu. Tekrar sipariş vereceğim.',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Elif Demir',
      text: 'Salatalar çok taze ve lezzetliydi. Sunum da çok güzeldi.',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Burak Can',
      text: 'Siparişim çok hızlı geldi, çalışanlar çok ilgili.',
      rating: 4,
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Seda Y.',
      text: 'Fiyatlar uygun, porsiyonlar büyük. Özellikle döneri çok beğendim.',
      rating: 5,
      img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    },
  ];
  const [reviewIndex, setReviewIndex] = useState(0);
  // Otomatik slider
  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev: number) => (prev + 3) % allReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [allReviews.length]);
  const showReviews = [
    allReviews[reviewIndex % allReviews.length],
    allReviews[(reviewIndex + 1) % allReviews.length],
    allReviews[(reviewIndex + 2) % allReviews.length],
  ];
  const handlePrev = () => {
    setReviewIndex((prev: number) => (prev - 3 + allReviews.length) % allReviews.length);
  };
  const handleNext = () => {
    setReviewIndex((prev: number) => (prev + 3) % allReviews.length);
  };

  return (
    <div className="min-h-screen w-full bg-food-cream">
      {/* Hero Section - Mersin ve öğrenci vurgulu */}
      <section className="w-full min-h-[400px] relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full floating"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-32 w-24 h-24 bg-secondary-400/20 rounded-full floating"
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 w-16 h-16 bg-primary-300/30 rounded-full floating"
            animate={{
              y: [0, -10, 0],
              x: [0, 10, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
        <div className="relative z-10 w-full px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center justify-center min-h-screen py-20 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Content */}
            <motion.div className="flex flex-col items-center justify-center text-center gap-6 w-full lg:max-w-lg mx-auto" variants={heroVariants}>
              <motion.div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white/90 border border-white/20 mx-auto" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Sparkles className="w-4 h-4 text-secondary-400" />
                <span className="text-sm font-medium">Mersin'in En Lezzetli Noktası</span>
              </motion.div>
              <motion.h1 className="display-2xl text-white mx-auto" variants={itemVariants}>
                LEZZET DURAĞI
                <span className="block text-4xl lg:text-5xl mt-4 font-normal text-secondary-400">Üniversite Caddesi, Yenişehir/MERSİN</span>
              </motion.h1>
              <motion.p className="text-body-lg text-white/90 max-w-md mx-auto leading-relaxed" variants={itemVariants}>
                Mersin'deki öğrencilere ve tüm lezzet tutkunlarına özel, uygun fiyatlı ve doyurucu menüler! Taze malzemelerle hazırlanan döner, makarna ve daha fazlası için hemen sipariş verin.
              </motion.p>
              {/* Features List */}
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mx-auto" variants={itemVariants}>
                {[
                  { icon: Check, text: "Taze malzemeler ile hazırlanır", color: "text-green-400" },
                  { icon: Clock, text: "15 dakikada hazır teslimat", color: "text-blue-400" },
                  { icon: Truck, text: "Ücretsiz teslimat hizmeti", color: "text-purple-400" },
                  { icon: Shield, text: "Hijyenik ve güvenli ortam", color: "text-yellow-400" },
                  { icon: Heart, text: "%100 müşteri memnuniyeti", color: "text-red-400" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 justify-center"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md`}>
                      <feature.icon className={`w-4 h-4 ${feature.color}`} />
                    </div>
                    <span className="text-white/90 text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
              {/* CTA Buttons */}
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full mt-4" variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/menu">
                    <Button size="lg" className="btn-secondary text-lg px-8 py-4">
                      <Zap className="mr-2 w-5 h-5" />
                      SİPARİŞ VER
                      <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
                    MENÜYÜ KEŞFET
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Content - Gerçek Yemek Görseli */}
            <motion.div
              className="hidden lg:flex items-center justify-center w-full lg:max-w-lg mx-auto"
              variants={heroVariants}
            >
              <div className="relative">
                {/* Main Food Image */}
                <motion.div
                  className="w-96 h-96 rounded-3xl overflow-hidden shadow-2xl relative"
                  animate={{
                    rotateY: [0, 5, 0],
                    rotateX: [0, -5, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 0,
                    rotateX: 0
                  }}
                >
                  {/* Gerçek Yemek Görseli */}
                  <img
                    src={optimizeImageUrl(heroImage.url, 800, 800)}
                    alt={heroImage.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                  {/* Food Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-poppins font-bold mb-2">{heroImage.alt}</h3>
                    <p className="text-white/80">Geleneksel tarifler</p>
                  </div>
                </motion.div>

                {/* Floating Food Elements */}
                <motion.div
                  className="absolute -top-4 -left-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop"
                    alt="Taze Yeşillik"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -right-4 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop"
                    alt="Taze Domates"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -right-8 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                  animate={{
                    y: [0, -5, 0],
                    x: [0, 5, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=100&h=100&fit=crop"
                    alt="Baharat"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Product Slider Section */}
      <ProductSlider
        title="Öne Çıkan Lezzetlerimiz"
        subtitle="En popüler yemeklerimizi keşfedin ve favori lezzetinizi bulun"
        autoPlay={true}
        interval={5000}
      />

      {/* About Section - Gerçek Yemek Görseli */}
      <section className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20 bg-white w-full">
        <div className="w-full px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Left - Gerçek Yemek Görseli */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-full h-96 rounded-3xl overflow-hidden shadow-xl relative">
                <img
                  src={optimizeImageUrl(aboutImage.url, 800, 600)}
                  alt={aboutImage.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Food Info */}
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-poppins font-bold mb-2">{aboutImage.alt}</h3>
                  <p className="text-white/80">İtalyan usulü hazırlanır</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Kalite Garantisi</span>
              </motion.div>

              <h2 className="heading-2xl text-gradient">
                Geleneksel Lezzetler, Modern Sunum
              </h2>

              <p className="text-body text-gray-600 leading-relaxed">
                Lezzet Durağı olarak, 2019 yılından bu yana geleneksel tarifleri modern mutfak teknikleriyle
                birleştirerek size unutulmaz lezzetler sunuyoruz. Taze malzemeler, uzman şeflerimiz ve
                hijyenik ortamımızla her lokmada kaliteyi hissedeceksiniz.
              </p>

              <p className="text-body text-gray-600 leading-relaxed">
                Müşteri memnuniyeti bizim için en önemli değerdir. Bu yüzden her yemeğimizi özenle hazırlar,
                en kaliteli malzemeleri kullanır ve sizlere en iyi hizmeti sunmaya çalışırız.
              </p>

              <motion.div
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">1000+</p>
                    <p className="text-sm text-gray-600">Mutlu Müşteri</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">5+ Yıl</p>
                    <p className="text-sm text-gray-600">Deneyim</p>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="btn-primary">
                  DAHA FAZLA BİLGİ
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Menümüz Section - Kategori filtreli ve 2 satır ürün */}
      <section className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20 bg-white py-20">
        <div className="w-full px-4 mb-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2xl text-primary-700 mb-6">
              MENÜMÜZ
            </h2>
            {/* Category Tabs */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-primary-600 hover:bg-primary-50 border border-primary-200'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {category.name}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
        {/* Product Grid - single row, 4 products max */}
        <div className="w-full px-4 flex flex-col items-center">
          <div className="w-full">
            <MenuList items={filteredItems} />
          </div>
          <div className="mt-8 flex justify-center">
            <Link to="/menu">
              <Button className="btn-primary flex items-center gap-2">
                Daha fazlası için tıklayın <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Deal Section - Gerçek Yemek Görseli */}
      <section className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20 bg-gradient-to-br from-primary-600 to-primary-800 w-full">
        <div className="w-full px-4">
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            {/* Left - Content */}
            <motion.div className="flex flex-col items-center justify-center text-center gap-4" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
              <motion.div className="mb-2" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-1">Sınırlı Süre</h3>
                <h2 className="heading-2xl text-white mb-2">
                  <span className="text-secondary-400">GÜNÜN</span>
                  <span className="block">TEKLİFİ</span>
                </h2>
              </motion.div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
                <div className="flex flex-col items-center bg-white/10 rounded-xl px-6 py-3">
                  <span className="text-3xl font-bold text-secondary-400">%25</span>
                  <span className="text-xs text-white/80">İndirim</span>
                </div>
                <div className="flex flex-col items-center bg-white/10 rounded-xl px-6 py-3">
                  <span className="text-2xl font-bold text-secondary-400 line-through">₺50</span>
                  <span className="text-3xl font-bold text-green-400">₺37.50</span>
                </div>
              </div>
              <p className="text-body text-white/90 leading-relaxed max-w-md mb-2">
                Bugün özel olarak hazırladığımız menü ile <span className="font-bold text-secondary-400">%25 indirim</span> fırsatını kaçırmayın! Taze malzemelerle hazırlanan özel menümüz sadece bugün geçerli.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full flex justify-center mt-2">
                <Button className="btn-secondary px-8 py-4 text-lg">
                  SİPARİŞ VER
                </Button>
              </motion.div>
            </motion.div>
            {/* Right - Gerçek Yemek Görseli */}
            <motion.div className="relative flex justify-center items-center" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <div className="w-full h-96 rounded-3xl overflow-hidden shadow-xl relative max-w-lg mx-auto">
                <img
                  src={optimizeImageUrl(specialDealImage.url, 800, 600)}
                  alt={specialDealImage.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                {/* Food Info */}
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-poppins font-bold mb-2">{specialDealImage.alt}</h3>
                  <p className="text-white/80">Taze malzemelerle</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews Section - Modern Slider */}
      <section className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20 bg-white w-full">
        <div className="w-full px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2xl text-primary-700 mb-6">
              MÜŞTERİ YORUMLARI
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" size="icon" onClick={handlePrev} aria-label="Önceki Yorumlar">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </Button>
              <div className="flex-1 flex justify-center gap-8">
                {showReviews.map((review, idx) => (
                  <motion.div key={idx} className="card p-6 w-80 h-80 flex flex-col items-center justify-start" style={{ minHeight: '20rem', maxHeight: '20rem' }} whileHover={{ scale: 1.03 }}>
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg mb-4">
                      <img src={review.img} alt={review.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <h3 className="text-lg font-bold text-primary-700 mb-1">{review.name}</h3>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-5 h-5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-gray-700 text-center mb-2 line-clamp-4 overflow-hidden" style={{ maxHeight: '4.5rem' }}>{review.text}</p>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={handleNext} aria-label="Sonraki Yorumlar">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </Button>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: Math.ceil(allReviews.length / 3) }).map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full ${i === Math.floor(reviewIndex / 3) ? 'bg-primary-500' : 'bg-gray-300'}`}
                  onClick={() => setReviewIndex(i * 3)}
                  aria-label={`Yorum seti ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - Food Restaurant Style */}
      <section className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20 bg-food-cream w-full">
        <div className="w-full px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Contact Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="heading-xl text-gradient">İLETİŞİM BİLGİLERİ</h3>

              <div className="space-y-4">
                {[
                  { icon: MapPin, title: "Adres", content: "Üniversite Caddesi, Yenişehir/MERSİN", link: "Bizi Ziyaret Edin" },
                  { icon: Mail, title: "E-posta", content: "info@lezzetduragi.com", link: "www.lezzetduragi.com" },
                  { icon: Phone, title: "Telefon", content: "+90 212 123 45 67", link: "Bizi Arayın" }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <contact.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{contact.title}</p>
                      <p className="text-gray-600">{contact.content}</p>
                      <a href="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        {contact.link}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="heading-xl text-gradient">SOSYAL MEDYA</h3>
              <p className="text-gray-600">
                Bizi sosyal medyada takip edin ve en güncel menülerimizi ve kampanyalarımızı kaçırmayın.
              </p>

              <div className="flex space-x-4">
                {['f', 'in', 't', 'g', 'yt'].map((platform, index) => (
                  <motion.div
                    key={platform}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors cursor-pointer shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-primary-600 font-bold">{platform}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Contact Form */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="heading-xl text-gradient">HIZLI İLETİŞİM</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Adınız"
                  className="input"
                />
                <input
                  type="email"
                  placeholder="E-posta"
                  className="input"
                />
                <textarea
                  placeholder="Mesajınız"
                  rows={4}
                  className="input resize-none"
                ></textarea>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="w-full btn-primary">
                    GÖNDER
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 