import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
      {/* Hero Section - Impossible Foods Style */}
      <section className="relative bg-primary-red text-white min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-poppins font-bold leading-tight">
                Lezzet Durağı
                <span className="block text-4xl lg:text-5xl mt-4 font-normal">
                  Taze & Lezzetli
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-100 max-w-lg">
                Geleneksel tariflerle hazırlanan, taze malzemelerle sunulan lezzetli yemeklerimizi keşfedin.
              </p>

              {/* Product Categories */}
              <div className="space-y-4">
                <h2 className="text-2xl font-poppins font-semibold">Menü Kategorileri</h2>
                <div className="space-y-2">
                  <Link to="/menu?category=doner" className="flex items-center text-lg hover:text-gray-200 transition-colors">
                    DÖNER <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link to="/menu?category=makarna" className="flex items-center text-lg hover:text-gray-200 transition-colors">
                    MAKARNA <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link to="/menu?category=salata" className="flex items-center text-lg hover:text-gray-200 transition-colors">
                    SALATA <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link to="/menu?category=icecek" className="flex items-center text-lg hover:text-gray-200 transition-colors">
                    İÇECEK <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link to="/menu">
                  <Button size="lg" className="bg-white text-primary-red hover:bg-gray-100 text-lg px-8 py-4 rounded-full">
                    MENÜYÜ KEŞFET
                    <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Food Images Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {/* Top Left - Döner Image */}
              <div className="bg-gradient-to-br from-primary-yellow to-orange-500 rounded-2xl p-6 flex items-center justify-center h-48">
                <div className="text-center">
                  <span className="text-6xl mb-2 block">🍖</span>
                  <p className="text-white font-poppins font-semibold">Döner</p>
                </div>
              </div>
              
              {/* Top Right - Makarna Image */}
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-6 flex items-center justify-center h-48">
                <div className="text-center">
                  <span className="text-6xl mb-2 block">🍝</span>
                  <p className="text-white font-poppins font-semibold">Makarna</p>
                </div>
              </div>
              
              {/* Bottom Left - Salata Image */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 flex items-center justify-center h-48">
                <div className="text-center">
                  <span className="text-6xl mb-2 block">🥗</span>
                  <p className="text-white font-poppins font-semibold">Salata</p>
                </div>
              </div>
              
              {/* Bottom Right - İçecek Image */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 flex items-center justify-center h-48">
                <div className="text-center">
                  <span className="text-6xl mb-2 block">🥤</span>
                  <p className="text-white font-poppins font-semibold">İçecek</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-poppins font-bold text-gray-800 mb-6">
              Öne Çıkan Lezzetler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En çok tercih edilen ve beğenilen yemeklerimizi keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 bg-white">
                <div className="h-64 bg-gradient-to-br from-primary-red to-primary-yellow flex items-center justify-center relative overflow-hidden">
                  <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
                    {item.category === 'doner' ? '🍖' : item.category === 'makarna' ? '🍝' : '🥗'}
                  </span>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-poppins font-bold text-gray-800 mb-3">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-primary-red">₺{item.price}</span>
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      className="bg-primary-red hover:bg-red-700 text-white px-6 py-3 rounded-full"
                    >
                      Sepete Ekle
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-poppins font-bold text-gray-800 mb-6">
              Özel Kampanyalar
            </h2>
            <p className="text-xl text-gray-600">
              Size özel indirimler ve fırsatlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
              <div className="bg-gradient-to-br from-primary-red to-red-600 text-white p-8">
                <h3 className="text-2xl font-poppins font-bold mb-2">Öğrenci İndirimi</h3>
                <p className="text-red-100 text-lg">%20 İndirim</p>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-6 text-lg">
                  Öğrenci kimliğinizi göstererek tüm menüde %20 indirim kazanın!
                </p>
                <Button className="w-full bg-primary-red hover:bg-red-700 text-white rounded-full py-3">
                  Detayları Gör
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
              <div className="bg-gradient-to-br from-primary-yellow to-orange-500 text-white p-8">
                <h3 className="text-2xl font-poppins font-bold mb-2">İlk Sipariş</h3>
                <p className="text-yellow-100 text-lg">%15 İndirim</p>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-6 text-lg">
                  İlk siparişinizde %15 indirim fırsatını kaçırmayın!
                </p>
                <Button className="w-full bg-primary-yellow hover:bg-orange-600 text-white rounded-full py-3">
                  Detayları Gör
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8">
                <h3 className="text-2xl font-poppins font-bold mb-2">Aile Menüsü</h3>
                <p className="text-gray-300 text-lg">4 Kişilik</p>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-6 text-lg">
                  4 kişilik aile menümüzle birlikte tatlı ve içecek hediye!
                </p>
                <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-full py-3">
                  Detayları Gör
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
} 