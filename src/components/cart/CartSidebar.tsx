import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { toggleCart, removeFromCart, updateQuantity } from '@/store/slices/cartSlice';

export function CartSidebar() {
    const dispatch = useDispatch();
    const { items, isOpen } = useSelector((state: RootState) => state.cart);

    const totalAmount = items.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => dispatch(toggleCart())}
            />

            {/* Cart Sidebar */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-poppins font-semibold text-gray-800">
                            Sepetiniz ({items.length} ürün)
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dispatch(toggleCart())}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {items.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl">🛒</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Sepetiniz Boş
                                </h3>
                                <p className="text-gray-600">
                                    Lezzetli yemeklerimizi keşfetmek için menüye göz atın
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <Card key={item.menuItem.id} className="p-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary-red to-primary-yellow rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {item.menuItem.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800">
                                                    {item.menuItem.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {item.menuItem.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => dispatch(updateQuantity({
                                                                menuItemId: item.menuItem.id,
                                                                quantity: item.quantity - 1
                                                            }))}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-8 text-center font-semibold">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => dispatch(updateQuantity({
                                                                menuItemId: item.menuItem.id,
                                                                quantity: item.quantity + 1
                                                            }))}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-semibold text-primary-red">
                                                            ₺{item.menuItem.price * item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => dispatch(removeFromCart(item.menuItem.id))}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t p-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-800">
                                    Toplam:
                                </span>
                                <span className="text-2xl font-bold text-primary-red">
                                    ₺{totalAmount}
                                </span>
                            </div>
                            <Button className="w-full bg-primary-red hover:bg-red-700">
                                Siparişi Tamamla
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 