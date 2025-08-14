import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MenuList } from '@/components/menu/MenuList';
import { menuData, getMenuByCategory } from '@/helpers/menuData';
import type { MenuItem } from '@/interfaces/menu-item';

const categories = [
    { id: 'all', name: 'Tümü', color: 'bg-gray-500' },
    { id: 'doner', name: 'Döner', color: 'bg-primary-red' },
    { id: 'makarna', name: 'Makarna', color: 'bg-primary-yellow' },
    { id: 'salata', name: 'Salata', color: 'bg-green-500' },
    { id: 'icecek', name: 'İçecek', color: 'bg-blue-500' }
];

export function MenuPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = menuData.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <section className="bg-gradient-to-r from-primary-red to-primary-yellow text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl lg:text-5xl font-poppins font-bold mb-4">
                        Menümüz
                    </h1>
                    <p className="text-xl text-gray-100 max-w-2xl mx-auto">
                        Taze malzemeler ve geleneksel tariflerle hazırlanan lezzetli yemeklerimizi keşfedin
                    </p>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Yemek ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`${selectedCategory === category.id
                                            ? category.color === 'bg-primary-red'
                                                ? 'bg-primary-red hover:bg-red-700'
                                                : category.color === 'bg-primary-yellow'
                                                    ? 'bg-primary-yellow hover:bg-orange-600'
                                                    : category.color === 'bg-green-500'
                                                        ? 'bg-green-500 hover:bg-green-600'
                                                        : category.color === 'bg-blue-500'
                                                            ? 'bg-blue-500 hover:bg-blue-600'
                                                            : 'bg-gray-500 hover:bg-gray-600'
                                            : ''
                                        }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Items Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <span className="text-4xl">🍽️</span>
                            </div>
                            <h3 className="text-2xl font-poppins font-semibold text-gray-800 mb-4">
                                Ürün Bulunamadı
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Arama kriterlerinize uygun ürün bulunamadı. Farklı bir arama yapmayı deneyin.
                            </p>
                            <Button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSearchTerm('');
                                }}
                                className="bg-primary-red hover:bg-red-700"
                            >
                                Tüm Menüyü Gör
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-2">
                                    {selectedCategory === 'all' ? 'Tüm Ürünler' :
                                        categories.find(c => c.id === selectedCategory)?.name}
                                </h2>
                                <p className="text-gray-600">
                                    {filteredItems.length} ürün bulundu
                                </p>
                            </div>
                            <MenuList menuItems={filteredItems} />
                        </>
                    )}
                </div>
            </section>
        </div>
    );
} 