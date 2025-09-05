import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Clock, Package, Edit, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { optimizeImageUrl } from '@/helpers/foodImages';
import type { UserAddress } from '@/interfaces/user';
import type { CartItem } from '@/contexts/CartContext';

interface ReviewStepProps {
    cartItems: CartItem[];
    selectedAddress: UserAddress | null;
    paymentMethod: 'cash' | 'card';
    notes: string;
    onNotesChange: (notes: string) => void;
    onCanProceed: (canProceed: boolean) => void;
    onEditAddress: () => void;
    onEditPayment: () => void;
    isPlacingOrder: boolean;
    onOpenPaymentModal?: () => void;
}

export function ReviewStep({
    cartItems,
    selectedAddress,
    paymentMethod,
    notes,
    onNotesChange,
    onCanProceed,
    onEditAddress,
    onEditPayment,
    isPlacingOrder,
    onOpenPaymentModal
}: ReviewStepProps) {
    const [estimatedTime, setEstimatedTime] = useState(0);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 50 ? 0 : 10;
    const total = subtotal + deliveryFee;

    // Calculate estimated preparation time
    useEffect(() => {
        const maxPrepTime = Math.max(...cartItems.map(item => 15)); // Default 15 min if no prep time
        setEstimatedTime(maxPrepTime + 15); // Add 15 min for delivery
        onCanProceed(true); // Review step can always proceed
    }, [cartItems, onCanProceed]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sipariş Özeti</h2>
                <p className="text-gray-600">Siparişinizi kontrol edin ve onaylayın</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column - Order Items */}
                <div className="space-y-4">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Sipariş Detayları ({cartItems.length} ürün)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cartItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 border-b last:border-b-0 pb-4 last:pb-0"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                        {item.image ? (
                                            <img
                                                src={optimizeImageUrl(item.image, 100, 100)}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                                                🍽️
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-gray-500">Adet: {item.quantity}</span>
                                            <span className="font-semibold text-primary-600">₺{item.price * item.quantity}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Order Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gift className="w-5 h-5" />
                                Sipariş Notları (İsteğe Bağlı)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                value={notes}
                                onChange={(e) => onNotesChange(e.target.value)}
                                placeholder="Özel isteklerinizi buraya yazabilirsiniz... (Örn: Baharatsız olsun, ekstra sos)"
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                rows={3}
                                maxLength={200}
                            />
                            <div className="text-xs text-gray-500 mt-2 text-right">
                                {notes.length}/200 karakter
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-4">
                    {/* Delivery Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Teslimat Adresi
                                </div>
                                <Button variant="ghost" size="sm" onClick={onEditAddress}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedAddress && (
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedAddress.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {selectedAddress.fullAddress || `${selectedAddress.address}, ${selectedAddress.district}, ${selectedAddress.city}`}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">{selectedAddress.phone}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Ödeme Yöntemi
                                </div>
                                <Button variant="ghost" size="sm" onClick={onEditPayment}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {paymentMethod === 'cash' ? (
                                        <>
                                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                                💰
                                            </div>
                                            <span>Kapıda Nakit Ödeme</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                💳
                                            </div>
                                            <span>Kredi Kartı</span>
                                        </>
                                    )}
                                </div>
                                
                                {/* Kredi kartı seçiliyse kart bilgileri butonu */}
                                {paymentMethod === 'card' && onOpenPaymentModal && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onOpenPaymentModal}
                                        className="text-primary-600 border-primary-300 hover:bg-primary-50"
                                    >
                                        <CreditCard className="w-4 h-4 mr-1" />
                                        Kart Bilgileri
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ödeme Özeti</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span>Ara Toplam</span>
                                <span>₺{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Teslimat Ücreti</span>
                                <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                                    {deliveryFee === 0 ? 'Ücretsiz' : `₺${deliveryFee.toFixed(2)}`}
                                </span>
                            </div>
                            {deliveryFee === 0 && (
                                <p className="text-xs text-green-600">🎉 50₺ üzeri siparişlerde teslimat ücretsiz!</p>
                            )}
                            <hr />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Toplam</span>
                                <span className="text-primary-600">₺{total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estimated Time */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 text-center justify-center">
                                <Clock className="w-5 h-5 text-primary-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Tahmini Teslimat Süresi</p>
                                    <p className="font-semibold text-primary-600">{estimatedTime} dakika</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
