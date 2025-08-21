import { useState } from 'react';
import { Search } from 'lucide-react';
import { MenuList } from '@/components/menu/MenuList';
import { menuData } from '@/helpers/menuData';
import { motion } from 'framer-motion';

export function MenuPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Kategori listesi
    const categories = [
        { id: 'all', name: 'Tümü', icon: '🍽️' },
        { id: 'doner', name: 'Döner', icon: '🍖' },
        { id: 'makarna', name: 'Makarna', icon: '🍝' },
        { id: 'salata', name: 'Salata', icon: '🥗' },
        { id: 'icecek', name: 'İçecek', icon: '🥤' }
    ];

    // Filtreleme fonksiyonu
    const filteredMenuData = menuData.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 pt-24 pb-20 shadow-xl overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent"></div>
                
                <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="text-3xl">🍽️</span>
                        </motion.div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-poppins text-white mb-6 drop-shadow-lg tracking-tight">
                            MENÜMÜZ
                        </h1>
                        
                        <motion.p 
                            className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Geleneksel tariflerle hazırlanan, taze malzemelerle sunulan lezzetli yemeklerimizi keşfedin. 
                            Her kategori için özenle seçilmiş menülerimiz.
                        </motion.p>
                        
                        <motion.div
                            className="flex flex-wrap justify-center gap-4 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                <span className="text-2xl">🍖</span>
                                <span className="text-white font-medium">Döner</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                <span className="text-2xl">🍝</span>
                                <span className="text-white font-medium">Makarna</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                <span className="text-2xl">🥗</span>
                                <span className="text-white font-medium">Salata</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Smooth bottom gradient */}
                <div className="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-transparent to-gray-50 pointer-events-none" />
            </section>
            {/* Search and Filter Section */}
            <section className="py-16 bg-gray-50">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                            <input
                                type="text"
                                placeholder="Yemek ara... (örn: döner, makarna, salata)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg transition-all duration-200 hover:shadow-md"
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                                        selectedCategory === category.id
                                            ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                                            : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <span className="text-2xl">{category.icon}</span>
                                    <span className="text-sm sm:text-base">{category.name}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Menu Items Section */}
            <section className="py-16 bg-white">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Results Info */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            {selectedCategory === 'all' ? 'Tüm Yemekler' : categories.find(c => c.id === selectedCategory)?.name}
                        </h2>
                        <p className="text-lg text-gray-600">
                            {filteredMenuData.length} yemek bulundu
                            {searchTerm && ` "${searchTerm}" araması için`}
                        </p>
                    </motion.div>

                    {/* Menu List */}
                    {filteredMenuData.length > 0 ? (
                        <MenuList items={filteredMenuData} />
                    ) : (
                        <motion.div
                            className="text-center py-20"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Yemek Bulunamadı
                            </h3>
                            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                                Aradığınız kriterlere uygun yemek bulunamadı.
                                Lütfen farklı bir arama terimi veya kategori deneyin.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                }}
                                className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                Tüm Menüyü Görüntüle
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                            Özel Menülerimizi Kaçırmayın!
                        </h2>
                        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Günlük özel menülerimiz ve kampanyalarımız için bizi takip edin.
                            Her gün farklı lezzetler, her gün yeni deneyimler.
                        </p>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button className="px-8 py-4 text-lg font-semibold shadow-xl rounded-xl bg-white text-primary-600 hover:bg-gray-50 hover:scale-105 transition-all duration-200">
                                Günlük Menüyü Görüntüle
                            </button>
                            <button className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-primary-600 hover:scale-105 rounded-xl shadow-xl transition-all duration-200">
                                Kampanyaları İncele
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
} 