import { ArrowRight, Star, Clock, Truck, Award, Users, MapPin, Phone, Mail, Check } from 'lucide-react';
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
      {/* Hero Section - Spucky's Style */}
      <section className="relative bg-blue-600 text-white min-h-screen flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-red-500 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-poppins font-bold leading-tight">
                  LEZZET DURAĞI
                  <span className="block text-2xl lg:text-3xl mt-4 font-normal text-yellow-300">
                    Döner & Makarna
                  </span>
                </h1>
                
                <p className="text-lg lg:text-xl text-white/90 max-w-lg leading-relaxed">
                  Geleneksel tariflerle hazırlanan, taze malzemelerle sunulan lezzetli yemeklerimizi keşfedin. 
                  Her lokmada kalite ve lezzet garantisi.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-white/90">Taze malzemeler ile hazırlanır</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-white/90">15 dakikada hazır teslimat</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-white/90">Ücretsiz teslimat hizmeti</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-white/90">Hijyenik ve güvenli ortam</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-white/90">%100 müşteri memnuniyeti</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link to="/menu">
                  <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-blue-600 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                    SİPARİŞ VER
                    <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Food Image */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Main Food Image */}
                <div className="w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="text-center">
                    <span className="text-8xl mb-4 block">🍖</span>
                    <h3 className="text-2xl font-poppins font-bold text-white">Taze Döner</h3>
                    <p className="text-white/80">Geleneksel tarifler</p>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🥬</span>
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🍅</span>
                </div>
                <div className="absolute top-1/2 -right-8 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">🧂</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <span className="text-8xl mb-4 block">🍝</span>
                  <h3 className="text-2xl font-poppins font-bold text-blue-600">Taze Makarna</h3>
                  <p className="text-blue-500">İtalyan usulü hazırlanır</p>
                </div>
              </div>
            </div>
            
            {/* Right - Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-poppins font-bold text-blue-600">
                HAKKIMIZDA
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Lezzet Durağı olarak, 2019 yılından bu yana geleneksel tarifleri modern mutfak teknikleriyle 
                birleştirerek size unutulmaz lezzetler sunuyoruz. Taze malzemeler, uzman şeflerimiz ve 
                hijyenik ortamımızla her lokmada kaliteyi hissedeceksiniz.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Müşteri memnuniyeti bizim için en önemli değerdir. Bu yüzden her yemeğimizi özenle hazırlar, 
                en kaliteli malzemeleri kullanır ve sizlere en iyi hizmeti sunmaya çalışırız.
              </p>
              
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg">
                DAHA FAZLA BİLGİ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-poppins font-bold text-blue-600 mb-6">
              MENÜMÜZ
            </h2>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Tümü
              </button>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors border border-blue-200">
                Döner
              </button>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors border border-blue-200">
                Makarna
              </button>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors border border-blue-200">
                Salata
              </button>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors border border-blue-200">
                İçecek
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-6xl">
                    {item.category === 'doner' ? '🍖' : item.category === 'makarna' ? '🍝' : '🥗'}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-poppins font-bold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">₺{item.price}</span>
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                      SİPARİŞ VER
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Deal Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Sınırlı Süre
                </h3>
                <h2 className="text-4xl lg:text-5xl font-poppins font-bold">
                  <span className="text-blue-600">GÜNÜN</span>
                  <span className="block text-gray-800">TEKLİFİ</span>
                </h2>
              </div>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Bugün özel olarak hazırladığımız menü ile %25 indirim fırsatını kaçırmayın! 
                Taze malzemelerle hazırlanan özel menümüz sadece bugün geçerli.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">%25</div>
                  <div className="text-sm text-gray-600">İndirim</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₺50</div>
                  <div className="text-sm text-gray-600">Yerine ₺37.50</div>
                </div>
              </div>
              
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-600 font-bold px-8 py-3 rounded-lg">
                SİPARİŞ VER
              </Button>
            </div>
            
            {/* Right - Image */}
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <span className="text-8xl mb-4 block">🍖</span>
                  <h3 className="text-2xl font-poppins font-bold text-orange-600">Özel Döner Menü</h3>
                  <p className="text-orange-500">Taze malzemelerle</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-poppins font-bold text-blue-600 mb-6">
              MÜŞTERİ YORUMLARI
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                </div>
                
                {/* Review Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl font-poppins font-bold text-gray-800 mb-2">
                    Ahmet Yılmaz
                  </h3>
                  <div className="flex justify-center lg:justify-start space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    "Lezzet Durağı'nda yediğim en lezzetli dönerdi! Taze malzemeler, 
                    hijyenik ortam ve hızlı servis. Kesinlikle tavsiye ederim. 
                    Özellikle özel sosları çok lezzetli."
                  </p>
                </div>
              </div>
            </div>
            
            {/* Review Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-poppins font-bold">İLETİŞİM BİLGİLERİ</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Adres</p>
                    <p className="text-white/80">İstanbul, Türkiye</p>
                    <a href="#" className="text-yellow-400 hover:text-yellow-300 text-sm">Bizi Ziyaret Edin</a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">E-posta</p>
                    <p className="text-white/80">info@lezzetduragi.com</p>
                    <a href="#" className="text-yellow-400 hover:text-yellow-300 text-sm">www.lezzetduragi.com</a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <p className="text-white/80">+90 212 123 45 67</p>
                    <a href="#" className="text-yellow-400 hover:text-yellow-300 text-sm">Bizi Arayın</a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="space-y-6">
              <h3 className="text-2xl font-poppins font-bold">SOSYAL MEDYA</h3>
              <p className="text-white/80">
                Bizi sosyal medyada takip edin ve en güncel menülerimizi ve kampanyalarımızı kaçırmayın.
              </p>
              
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors cursor-pointer">
                  <span className="text-blue-600 font-bold">f</span>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors cursor-pointer">
                  <span className="text-blue-600 font-bold">in</span>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors cursor-pointer">
                  <span className="text-blue-600 font-bold">t</span>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors cursor-pointer">
                  <span className="text-blue-600 font-bold">g</span>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors cursor-pointer">
                  <span className="text-blue-600 font-bold">yt</span>
                </div>
              </div>
            </div>
            
            {/* Quick Contact Form */}
            <div className="space-y-6">
              <h3 className="text-2xl font-poppins font-bold">HIZLI İLETİŞİM</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Adınız" 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-yellow-400"
                />
                <input 
                  type="email" 
                  placeholder="E-posta" 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-yellow-400"
                />
                <textarea 
                  placeholder="Mesajınız" 
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-yellow-400 resize-none"
                ></textarea>
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-600 font-bold py-3 rounded-lg">
                  GÖNDER
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 