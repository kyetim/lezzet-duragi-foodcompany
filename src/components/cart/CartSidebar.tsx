import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { optimizeImageUrl } from '@/helpers/foodImages';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
    const { state, removeItem, updateQuantity } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsProcessing(true);
        onClose();
        navigate('/checkout');
        setTimeout(() => setIsProcessing(false), 500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    {/* Sidebar */}
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b bg-white">
                            <h2 className="text-xl font-poppins font-bold text-primary-700 tracking-tight">
                                Sepetiniz <span className="text-base font-normal text-gray-500">({state.items.length} ürün)</span>
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-gray-100"
                                onClick={onClose}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {state.items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-24 text-center">
                                    <span className="text-6xl mb-4">🛒</span>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Sepetiniz Boş</h3>
                                    <p className="text-gray-500 mb-4">Lezzetli yemeklerimizi keşfetmek için menüye göz atın.</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {state.items.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-4 border-b last:border-b-0 pb-4"
                                        >
                                            {/* Ürün Görseli */}
                                            <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 shadow">
                                                {item.image && item.image.trim() !== '' ? (
                                                    <img
                                                        src={optimizeImageUrl(item.image, 100, 100)}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                        🍽️
                                                    </div>
                                                )}
                                            </div>

                                            {/* Ürün Bilgileri */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-base truncate mb-1">{item.name}</h3>
                                                <p className="text-xs text-gray-500 truncate mb-2">{item.description}</p>
                                                <div className="flex items-center gap-2">
                                                    <motion.div whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="rounded-full w-8 h-8 flex items-center justify-center"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                    </motion.div>
                                                    <motion.span
                                                        key={item.quantity}
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-8 text-center font-semibold text-lg"
                                                    >
                                                        {item.quantity}
                                                    </motion.span>
                                                    <motion.div whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="rounded-full w-8 h-8 flex items-center justify-center"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* Fiyat ve Sil */}
                                            <div className="flex flex-col items-end gap-2 min-w-[70px]">
                                                <motion.span
                                                    key={item.price * item.quantity}
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    className="font-bold text-primary-600 text-lg"
                                                >
                                                    ₺{item.price * item.quantity}
                                                </motion.span>
                                                <motion.div whileTap={{ scale: 0.9 }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700 rounded-full w-8 h-8 flex items-center justify-center"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {state.items.length > 0 && (
                            <motion.div
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                className="sticky bottom-0 z-10 bg-white border-t px-6 py-5 shadow-[0_-2px_16px_0_rgba(0,0,0,0.04)]"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-800">Toplam:</span>
                                    <motion.span
                                        key={state.total}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="text-2xl font-bold text-primary-red"
                                    >
                                        ₺{state.total}
                                    </motion.span>
                                </div>
                                <motion.div whileTap={{ scale: 0.98 }}>
                                    <Button
                                        className="w-full btn-primary text-lg py-3 rounded-xl shadow-xl"
                                        variant="default"
                                        onClick={handleCheckout}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? 'Yönlendiriliyor...' : 'Siparişi Tamamla'}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
}