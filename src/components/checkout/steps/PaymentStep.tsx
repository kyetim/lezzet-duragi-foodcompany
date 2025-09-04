import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Banknote, CheckCircle, Shield, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PaymentStepProps {
    paymentMethod: 'cash' | 'card';
    onPaymentMethodSelect: (method: 'cash' | 'card') => void;
    onCanProceed: (canProceed: boolean) => void;
    onOpenPaymentModal?: () => void; // Kredi kartı seçilince popup aç
}

const paymentOptions = [
    {
        id: 'cash' as const,
        title: 'Kapıda Nakit Ödeme',
        description: 'Sipariş tesliminde nakit olarak ödeyin',
        icon: Banknote,
        features: ['Hızlı ve pratik', 'Ekstra ücret yok', 'Güvenli teslimat'],
        color: 'bg-green-100 text-green-600 border-green-200',
        selectedColor: 'border-green-500 bg-green-50',
        iconColor: 'text-green-600'
    },
    {
        id: 'card' as const,
        title: 'Kredi Kartı',
        description: 'Güvenli online ödeme',
        icon: CreditCard,
        features: ['Anında ödeme', 'Güvenli SSL', '3D Secure'],
        color: 'bg-blue-100 text-blue-600 border-blue-200',
        selectedColor: 'border-blue-500 bg-blue-50',
        iconColor: 'text-blue-600'
    }
];

export function PaymentStep({
    paymentMethod,
    onPaymentMethodSelect,
    onCanProceed,
    onOpenPaymentModal
}: PaymentStepProps) {

    useEffect(() => {
        // Ödeme yöntemi seçildiyse proceed edilebilir
        onCanProceed(!!paymentMethod);
    }, [paymentMethod, onCanProceed]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Yöntemi</h2>
                <p className="text-gray-600">Size uygun ödeme yöntemini seçin</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {paymentOptions.map((option, index) => {
                    const isSelected = paymentMethod === option.id;
                    const IconComponent = option.icon;

                    return (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                className={`cursor-pointer transition-all duration-300 border-2 ${isSelected
                                    ? `${option.selectedColor} shadow-lg`
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                onClick={() => {
                                    onPaymentMethodSelect(option.id);
                                    // Kredi kartı seçilince otomatik popup aç
                                    if (option.id === 'card' && onOpenPaymentModal) {
                                        setTimeout(() => onOpenPaymentModal(), 300); // Kısa delay ile smooth açılım
                                    }
                                }}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center`}>
                                            <IconComponent className={`w-6 h-6 ${option.iconColor}`} />
                                        </div>

                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 500 }}
                                            >
                                                <CheckCircle className="w-6 h-6 text-primary-500" />
                                            </motion.div>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{option.description}</p>

                                    <div className="space-y-2">
                                        {option.features.map((feature, featureIndex) => (
                                            <motion.div
                                                key={featureIndex}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                                                className="flex items-center gap-2 text-sm text-gray-600"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                                                {feature}
                                            </motion.div>
                                        ))}
                                    </div>

                                    {option.id === 'card' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="mt-4 flex items-center gap-2 text-xs text-gray-500"
                                        >
                                            <Shield className="w-3 h-3" />
                                            <span>256-bit SSL şifrelemeli güvenli ödeme</span>
                                        </motion.div>
                                    )}

                                    {option.id === 'cash' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="mt-4 flex items-center gap-2 text-xs text-gray-500"
                                        >
                                            <Zap className="w-3 h-3" />
                                            <span>Hızlı hazırlık, anında teslimat</span>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Selected Payment Method Summary */}
            <AnimatePresence>
                {paymentMethod && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-primary-50 border border-primary-200 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-2 text-primary-700">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">
                                Seçili Ödeme: {paymentOptions.find(p => p.id === paymentMethod)?.title}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
