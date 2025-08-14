import { ArrowRight, ChevronRight, Star, Clock, Truck, Award, Users, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { getFeaturedItems } from '@/helpers/menuData';

export function HomePage() {
  const dispatch = useDispatch();
  const featuredItems = getFeaturedItems();

  const handleAddToCart = (menuItem: any) => {
    dispatch(addToCart({ menuItem, quantity: 1 }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Modern Design */}
      <section className="hero-section bg-animated">
        <div className="hero-bg"></div>
        <div className="hero-pattern"></div>
        
        <div className="container-modern relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-white/10 dark:bg-dark-card/10 backdrop-blur-md rounded-full px-4 py-2 text-white/90">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">4.9/5 Müşteri Puanı</span>
                </div>
                
                <h1 className="heading-xl text-white">
                  Lezzet Durağı
                  <span className="block text-4xl lg:text-5xl mt-4 font-normal text-yellow-300">
                    Taze & Lezzetli
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-white/90 max-w-lg leading-relaxed">
                  Geleneksel tariflerle hazırlanan, taze malzemelerle sunulan lezzetli yemeklerimizi keşfedin.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                  <p className="text-white/80 text-sm">15 dk</p>
                  <p className="text-white/60 text-xs">Hazırlama</p>
                </div>
                <div className="text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                  <p className="text-white/80 text-sm">Ücretsiz</p>
                  <p className="text-white/60 text-xs">Teslimat</p>
                </div>
                <div className="text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                  <p className="text-white/80 text-sm">%100</p>
                  <p className="text-white/60 text-xs">Taze</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/menu">
                  <Button size="lg" className="btn-primary text-lg px-8 py-4">
                    MENÜYÜ KEŞFET
                    <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-red">
                  SİPARİŞ VER
                </Button>
              </div>
            </div>

            {/* Right Content - Food Showcase */}
            <div className="hidden lg:grid grid-cols-2 gap-6 animate-slide-up">
              {/* Top Row */}
              <div className="space-y-6">
                <div className="card-glass p-6 text-center hover-lift group">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🍖</span>
                  </div>
                  <h3 className="text-white font-poppins font-semibold mb-2">Döner</h3>
                  <p className="text-white/70 text-sm">Geleneksel tarifler</p>
                </div>
                
                <div className="card-glass p-6 text-center hover-lift group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🥗</span>
                  </div>
                  <h3 className="text-white font-poppins font-semibold mb-2">Salata</h3>
                  <p className="text-white/70 text-sm">Taze sebzeler</p>
                </div>
              </div>
              
              {/* Bottom Row */}
              <div className="space-y-6 mt-12">
                <div className="card-glass p-6 text-center hover-lift group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🍝</span>
                  </div>
                  <h3 className="text-white font-poppins font-semibold mb-2">Makarna</h3>
                  <p className="text-white/70 text-sm">İtalyan usulü</p>
                </div>
                
                <div className="card-glass p-6 text-center hover-lift group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🥤</span>
                  </div>
                  <h3 className="text-white font-poppins font-semibold mb-2">İçecek</h3>
                  <p className="text-white/70 text-sm">Soğuk & sıcak</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full floating"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-300/10 rounded-full floating" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full floating" style={{ animationDelay: '4s' }}></div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-white dark:bg-dark-bg">
        <div className="container-modern">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-primary-red/10 text-primary-red rounded-full px-4 py-2">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Kalite Garantisi</span>
              </div>
              
              <h2 className="heading-lg text-gradient-dark">
                Geleneksel Lezzetler, Modern Sunum
              </h2>
              
              <p className="text-body text-gray-600 dark:text-dark-text-secondary">
                Lezzet Durağı olarak, geleneksel tarifleri modern mutfak teknikleriyle birleştirerek 
                size unutulmaz lezzetler sunuyoruz. Taze malzemeler, uzman şeflerimiz ve 
                hijyenik ortamımızla her lokmada kaliteyi hissedeceksiniz.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-red/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-red" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-dark-text">1000+</p>
                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Mutlu Müşteri</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-yellow/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-yellow" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-dark-text">5+ Yıl</p>
                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Deneyim</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="card-modern p-6 text-center hover-lift">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-red to-red-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">🍖</span>
                    </div>
                    <h3 className="font-poppins font-semibold text-gray-900 dark:text-dark-text">Taze Et</h3>
                  </div>
                  <div className="card-modern p-6 text-center hover-lift">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">🥬</span>
                    </div>
                    <h3 className="font-poppins font-semibold text-gray-900 dark:text-dark-text">Organik Sebze</h3>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="card-modern p-6 text-center hover-lift">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-yellow to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">🧂</span>
                    </div>
                    <h3 className="font-poppins font-semibold text-gray-900 dark:text-dark-text">Doğal Baharat</h3>
                  </div>
                  <div className="card-modern p-6 text-center hover-lift">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">💧</span>
                    </div>
                    <h3 className="font-poppins font-semibold text-gray-900 dark:text-dark-text">Temiz Su</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-gray-50 dark:bg-dark-card">
        <div className="container-modern">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="heading-lg text-gradient-dark mb-6">
              Öne Çıkan Lezzetler
            </h2>
            <p className="text-body text-gray-600 dark:text-dark-text-secondary max-w-3xl mx-auto">
              En çok tercih edilen ve beğenilen yemeklerimizi keşfedin. Her biri özenle hazırlanmış, 
              taze malzemelerle sunulan lezzetlerimiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="card-modern overflow-hidden hover-lift group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-64 bg-gradient-to-br from-primary-red to-primary-yellow flex items-center justify-center relative overflow-hidden">
                  <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
                    {item.category === 'doner' ? '🍖' : item.category === 'makarna' ? '🍝' : '🥗'}
                  </span>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-8">
                  <h3 className="heading-md text-gray-900 dark:text-dark-text mb-3">
                    {item.name}
                  </h3>
                  <p className="text-body text-gray-600 dark:text-dark-text-secondary mb-6">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-gradient">₺{item.price}</span>
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      className="btn-primary"
                    >
                      Sepete Ekle
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="section-padding bg-white dark:bg-dark-bg">
        <div className="container-modern">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="heading-lg text-gradient-dark mb-6">
              Özel Kampanyalar
            </h2>
            <p className="text-body text-gray-600 dark:text-dark-text-secondary">
              Size özel indirimler ve fırsatlar ile lezzetli yemeklerin keyfini çıkarın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-modern overflow-hidden hover-lift group">
              <div className="bg-gradient-to-br from-primary-red to-red-600 text-white p-8">
                <h3 className="heading-md mb-2">Öğrenci İndirimi</h3>
                <p className="text-red-100 text-lg">%20 İndirim</p>
              </div>
              <div className="p-8">
                <p className="text-body text-gray-600 dark:text-dark-text-secondary mb-6">
                  Öğrenci kimliğinizi göstererek tüm menüde %20 indirim kazanın!
                </p>
                <Button className="w-full btn-primary">
                  Detayları Gör
                </Button>
              </div>
            </div>

            <div className="card-modern overflow-hidden hover-lift group">
              <div className="bg-gradient-to-br from-primary-yellow to-orange-500 text-white p-8">
                <h3 className="heading-md mb-2">İlk Sipariş</h3>
                <p className="text-yellow-100 text-lg">%15 İndirim</p>
              </div>
              <div className="p-8">
                <p className="text-body text-gray-600 dark:text-dark-text-secondary mb-6">
                  İlk siparişinizde %15 indirim fırsatını kaçırmayın!
                </p>
                <Button className="w-full btn-secondary">
                  Detayları Gör
                </Button>
              </div>
            </div>

            <div className="card-modern overflow-hidden hover-lift group">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8">
                <h3 className="heading-md mb-2">Aile Menüsü</h3>
                <p className="text-gray-300 text-lg">4 Kişilik</p>
              </div>
              <div className="p-8">
                <p className="text-body text-gray-600 dark:text-dark-text-secondary mb-6">
                  4 kişilik aile menümüzle birlikte tatlı ve içecek hediye!
                </p>
                <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-xl py-3">
                  Detayları Gör
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-gradient-to-br from-primary-red to-primary-yellow text-white">
        <div className="container-modern">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="heading-lg text-white">
                Bize Ulaşın
              </h2>
              <p className="text-xl text-white/90">
                Sorularınız için bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Adres</p>
                    <p className="text-white/80">İstanbul, Türkiye</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <p className="text-white/80">+90 212 123 45 67</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">E-posta</p>
                    <p className="text-white/80">info@lezzetduragi.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-glass p-8 animate-slide-up">
              <h3 className="heading-md mb-6">Hızlı İletişim</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Adınız" 
                  className="input-modern bg-white/10 border-white/20 text-white placeholder-white/60"
                />
                <input 
                  type="email" 
                  placeholder="E-posta" 
                  className="input-modern bg-white/10 border-white/20 text-white placeholder-white/60"
                />
                <textarea 
                  placeholder="Mesajınız" 
                  rows={4}
                  className="input-modern bg-white/10 border-white/20 text-white placeholder-white/60 resize-none"
                ></textarea>
                <Button className="w-full btn-primary">
                  Gönder
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 