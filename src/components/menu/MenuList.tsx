import { Plus, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import type { MenuItem } from '@/interfaces/menu-item';

interface MenuListProps {
    menuItems: MenuItem[];
}

export function MenuList({ menuItems }: MenuListProps) {
    const dispatch = useDispatch();

    const handleAddToCart = (menuItem: MenuItem) => {
        dispatch(addToCart({ menuItem, quantity: 1 }));
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'doner':
                return 'from-primary-red to-red-600';
            case 'makarna':
                return 'from-primary-yellow to-orange-500';
            case 'salata':
                return 'from-green-500 to-green-600';
            case 'icecek':
                return 'from-blue-500 to-blue-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'doner':
                return '🍖';
            case 'makarna':
                return '🍝';
            case 'salata':
                return '🥗';
            case 'icecek':
                return '🥤';
            default:
                return '🍽️';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    {/* Image Placeholder */}
                    <div className={`h-48 bg-gradient-to-br ${getCategoryColor(item.category)} flex items-center justify-center relative overflow-hidden`}>
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                            {getCategoryIcon(item.category)}
                        </span>
                        {!item.isAvailable && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">Mevcut Değil</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-poppins font-semibold text-gray-800 group-hover:text-primary-red transition-colors">
                                {item.name}
                            </h3>
                            <span className="text-2xl font-bold text-primary-red">
                                ₺{item.price}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                            {item.description}
                        </p>

                        {/* Details */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>{item.preparationTime} dk</span>
                                </div>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                    <span>4.8</span>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        {item.ingredients && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Malzemeler:</p>
                                <div className="flex flex-wrap gap-1">
                                    {item.ingredients.slice(0, 3).map((ingredient, index) => (
                                        <span
                                            key={index}
                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                        >
                                            {ingredient}
                                        </span>
                                    ))}
                                    {item.ingredients.length > 3 && (
                                        <span className="text-xs text-gray-500">
                                            +{item.ingredients.length - 3} daha
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <Button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.isAvailable}
                            className="w-full bg-primary-red hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {item.isAvailable ? 'Sepete Ekle' : 'Mevcut Değil'}
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
} 