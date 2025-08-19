import { Link } from 'react-router-dom';
import { Button } from './button';
import { ShoppingCart, Clock } from 'lucide-react';
import { getFoodImagesByCategory, optimizeImageUrl } from '@/helpers/foodImages';
import type { MenuItem } from '@/interfaces/menu-item';

interface ProductCardProps {
    item: MenuItem;
    onAddToCart?: (item: MenuItem) => void;
    showDetailsButton?: boolean;
    className?: string;
}

export function ProductCard({ item, onAddToCart, showDetailsButton = true, className = '' }: ProductCardProps) {
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'doner': return '🍖';
            case 'makarna': return '🍝';
            case 'salata': return '🥗';
            case 'icecek': return '🥤';
            default: return '🍽️';
        }
    };
    let itemImage = item.image || item.imageUrl || '';
    if (!itemImage) {
        // Fallback: kategoriye göre bir görsel veya genel bir placeholder
        itemImage = getFoodImagesByCategory(item.category)[0]?.url || 'https://via.placeholder.com/400x300?text=Yemek';
    }
    itemImage = optimizeImageUrl(itemImage, 400, 300);
    return (
        <div className={`bg-white rounded-2xl shadow-xl flex flex-col group transition-all duration-300 hover:shadow-2xl ${className}`}>
            <Link to={`/product/${item.id}`} className="block">
                <div className="h-48 relative overflow-hidden rounded-t-2xl">
                    {itemImage ? (
                        <img
                            src={itemImage}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-lg">Görsel Yok</div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm">
                            {getCategoryIcon(item.category)} {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                    </div>
                    {/* Availability Badge */}
                    {!item.isAvailable && (
                        <div className="absolute top-3 right-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                                Stokta Yok
                            </span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="flex flex-col flex-1 p-6 min-h-[260px]">
                <div className="flex justify-between items-start mb-2">
                    <Link to={`/product/${item.id}`} className="group-hover:text-primary-600 transition-colors">
                        <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">{item.name}</h3>
                    </Link>
                    <span className="text-2xl font-bold text-primary-600">₺{item.price}</span>
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                {/* Ingredients */}
                {item.ingredients && item.ingredients.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {item.ingredients.slice(0, 3).map((ing, i) => (
                            <span key={i} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">{ing}</span>
                        ))}
                        {item.ingredients.length > 3 && (
                            <span className="bg-gray-100 text-gray-500 rounded-full px-3 py-1 text-xs font-medium">+{item.ingredients.length - 3} daha</span>
                        )}
                    </div>
                )}
                {/* Time */}
                {item.time && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{item.time} dakika</span>
                    </div>
                )}
                <div className="mt-auto flex flex-col gap-2">
                    {onAddToCart && (
                        <Button onClick={() => onAddToCart(item)} className="btn-secondary flex items-center gap-2 w-full justify-center">
                            <ShoppingCart className="w-4 h-4" /> Sepete Ekle
                        </Button>
                    )}
                    {showDetailsButton && (
                        <Link to={`/product/${item.id}`} className="w-full">
                            <Button variant="outline" className="w-full mt-1">Detayları Gör</Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
