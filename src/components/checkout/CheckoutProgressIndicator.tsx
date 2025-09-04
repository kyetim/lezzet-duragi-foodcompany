import { motion } from 'framer-motion';
import { CheckCircle, MapPin, CreditCard, Package } from 'lucide-react';

interface Step {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface CheckoutProgressIndicatorProps {
    currentStep: number;
}

const steps: Step[] = [
    {
        id: 'address',
        title: 'Teslimat Adresi',
        description: 'Adres seçimi',
        icon: MapPin
    },
    {
        id: 'payment',
        title: 'Ödeme Yöntemi',
        description: 'Ödeme seçimi',
        icon: CreditCard
    },
    {
        id: 'review',
        title: 'Sipariş Özeti',
        description: 'Son kontrol',
        icon: Package
    }
];

export function CheckoutProgressIndicator({ currentStep }: CheckoutProgressIndicatorProps) {
    return (
        <div className="w-full mb-8">
            {/* Desktop Progress Bar */}
            <div className="hidden md:block">
                <div className="flex items-center justify-between relative">
                    {/* Background Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

                    {/* Progress Line */}
                    <motion.div
                        className="absolute top-1/2 left-0 h-0.5 bg-primary-500 -translate-y-1/2 z-10"
                        initial={{ width: '0%' }}
                        animate={{
                            width: currentStep === 0 ? '0%' : currentStep === 1 ? '50%' : '100%'
                        }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />

                    {steps.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isCurrent = index === currentStep;
                        const isUpcoming = index > currentStep;
                        const IconComponent = step.icon;

                        return (
                            <motion.div
                                key={step.id}
                                className="relative z-20 flex flex-col items-center"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {/* Step Circle */}
                                <motion.div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                            ? 'bg-primary-500 border-primary-500 text-white'
                                            : isCurrent
                                                ? 'bg-white border-primary-500 text-primary-500 shadow-lg'
                                                : 'bg-white border-gray-300 text-gray-400'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                                    transition={{ duration: 2, repeat: isCurrent ? Infinity : 0 }}
                                >
                                    {isCompleted ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 500 }}
                                        >
                                            <CheckCircle className="w-6 h-6" />
                                        </motion.div>
                                    ) : (
                                        <IconComponent className="w-6 h-6" />
                                    )}
                                </motion.div>

                                {/* Step Info */}
                                <motion.div
                                    className="mt-3 text-center"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                >
                                    <h3 className={`text-sm font-semibold ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-primary-500' : 'text-gray-500'
                                        }`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-xs mt-1 ${isCurrent ? 'text-primary-400' : 'text-gray-400'
                                        }`}>
                                        {step.description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Progress Bar */}
            <div className="md:hidden">
                <div className="flex items-center mb-4">
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary-500 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{
                                width: `${((currentStep + 1) / steps.length) * 100}%`
                            }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-600">
                        {currentStep + 1} / {steps.length}
                    </span>
                </div>

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                >
                    <h3 className="text-lg font-semibold text-primary-600">
                        {steps[currentStep]?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {steps[currentStep]?.description}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
