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
        <div className="min-h-screen bg-food-cream">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 pt-32 pb-16 shadow-md overflow-hidden">
                <div className="w-full px-4">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold font-poppins text-white mb-6 drop-shadow-lg tracking-tight">
                            MENÜMÜZ
                        </h1>
                        <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-medium">
                            Geleneksel tariflerle hazırlanan, taze malzemelerle sunulan lezzetli yemeklerimizi keşfedin. Her kategori için özenle seçilmiş menülerimiz.
                        </p>
                    </motion.div>
                </div>
                {/* Daha uzun ve yumuşak bir alt gradient */}
                <div className="absolute left-0 right-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#fffbe6] pointer-events-none" />
            </section>
            {/* Search and Filter Section */}
            <section className="pt-16 pb-12 bg-[#fffbe6]">
                <div className="w-full px-4">
                    <motion.div
                        className="max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Search Bar */}
                        <div className="relative mb-8">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Yemek ara... (örn: döner, makarna, salata)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${selectedCategory === category.id
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-white text-primary-600 hover:bg-primary-50 border border-primary-200'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <span className="text-xl">{category.icon}</span>
                                    <span>{category.name}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Menu Items Section */}
            <section className="py-16 bg-[#fffbe6]">
                <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
                    {/* Results Info */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h2 className="heading-xl text-gray-800 mb-4">
                            {selectedCategory === 'all' ? 'Tüm Yemekler' : categories.find(c => c.id === selectedCategory)?.name}
                        </h2>
                        <p className="text-gray-600">
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
                            <h3 className="heading-lg text-gray-800 mb-4">
                                Yemek Bulunamadı
                            </h3>
                            <p className="text-gray-600 mb-8">
                                Aradığınız kriterlere uygun yemek bulunamadı.
                                Lütfen farklı bir arama terimi veya kategori deneyin.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                }}
                                className="btn-primary"
                            >
                                Tüm Menüyü Görüntüle
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 bg-gradient-to-br from-secondary-500 to-secondary-600">
                <div className="w-full px-4">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="heading-2xl text-white mb-6">
                            Özel Menülerimizi Kaçırmayın!
                        </h2>
                        <p className="text-body-lg text-white/80 mb-8 max-w-2xl mx-auto">
                            Günlük özel menülerimiz ve kampanyalarımız için bizi takip edin.
                            Her gün farklı lezzetler, her gün yeni deneyimler.
                        </p>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button className="btn-primary bg-white text-secondary-600 hover:bg-gray-100">
                                Günlük Menüyü Görüntüle
                            </button>
                            <button className="btn-outline border-white text-white hover:bg-white hover:text-secondary-600">
                                Kampanyaları İncele
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
} 