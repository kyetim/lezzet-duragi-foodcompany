import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getFoodImagesByCategory, getRandomFoodImage, optimizeImageUrl } from '@/helpers/foodImages';
import type { MenuItem } from '@/interfaces/menu-item';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/ui/ProductCard';

interface MenuListProps {
    items: MenuItem[];
}

export function MenuList({ items }: MenuListProps) {
    const { addItem } = useCart();

    const handleAddToCart = (menuItem: MenuItem) => {
        addItem({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
            image: menuItem.image,
            description: menuItem.description,
            category: menuItem.category
        });
    };

    // Kategori ikonları
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
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
                {items.map((item, index) => (
                    <ProductCard
                        key={item.id}
                        item={item}
                        onAddToCart={handleAddToCart}
                        showDetailsButton={true}
                    />
                ))}
            </div>
        </div>
    );
} 