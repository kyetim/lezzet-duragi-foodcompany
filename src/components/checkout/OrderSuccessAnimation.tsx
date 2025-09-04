import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Heart, Star } from 'lucide-react';

interface ConfettiPiece {
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    icon: string;
    delay: number;
}

interface OrderSuccessAnimationProps {
    isVisible: boolean;
    orderNumber: string;
    amount: number;
}

export function OrderSuccessAnimation({ isVisible, orderNumber, amount }: OrderSuccessAnimationProps) {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (isVisible) {
            // Generate confetti pieces
            const pieces: ConfettiPiece[] = [];
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
            const icons = ['🎉', '🎊', '⭐', '💖', '✨', '🌟', '🎈'];

            for (let i = 0; i < 50; i++) {
                pieces.push({
                    id: i,
                    x: Math.random() * 100,
                    y: -10,
                    rotation: Math.random() * 360,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    icon: icons[Math.floor(Math.random() * icons.length)],
                    delay: Math.random() * 2
                });
            }
            setConfetti(pieces);
        }
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
                >
                    {/* Confetti */}
                    {confetti.map((piece) => (
                        <motion.div
                            key={piece.id}
                            initial={{
                                x: `${piece.x}vw`,
                                y: `${piece.y}vh`,
                                rotate: 0,
                                scale: 0
                            }}
                            animate={{
                                x: `${piece.x + (Math.random() - 0.5) * 20}vw`,
                                y: '110vh',
                                rotate: piece.rotation + 720,
                                scale: [0, 1, 1, 0.5]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                delay: piece.delay,
                                ease: 'easeOut'
                            }}
                            className="absolute text-2xl"
                            style={{ left: `${piece.x}%`, color: piece.color }}
                        >
                            {piece.icon}
                        </motion.div>
                    ))}

                    {/* Success Card */}
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <motion.div
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 15,
                                delay: 0.5
                            }}
                            className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center relative overflow-hidden"
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-4 left-4 text-6xl">🎉</div>
                                <div className="absolute top-4 right-4 text-6xl">🎊</div>
                                <div className="absolute bottom-4 left-4 text-6xl">⭐</div>
                                <div className="absolute bottom-4 right-4 text-6xl">✨</div>
                            </div>

                            {/* Success Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    delay: 0.7
                                }}
                                className="relative"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 10, -10, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: 'loop'
                                        }}
                                    >
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Success Message */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Siparişiniz Alındı! 🎉
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Teşekkürler! Siparişiniz başarıyla oluşturuldu ve hazırlanmaya başlandı.
                                </p>
                            </motion.div>

                            {/* Order Details */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2 }}
                                className="bg-gray-50 rounded-xl p-4 mb-6"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Sipariş No:</span>
                                    <span className="font-semibold text-primary-600">{orderNumber}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Toplam Tutar:</span>
                                    <span className="text-xl font-bold text-green-600">₺{amount.toFixed(2)}</span>
                                </div>
                            </motion.div>

                            {/* Sparkle Animation */}
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'linear'
                                }}
                                className="absolute top-6 right-6"
                            >
                                <Sparkles className="w-6 h-6 text-yellow-400" />
                            </motion.div>

                            <motion.div
                                animate={{
                                    rotate: -360,
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'linear',
                                    delay: 1
                                }}
                                className="absolute bottom-6 left-6"
                            >
                                <Star className="w-5 h-5 text-purple-400" />
                            </motion.div>

                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 15, -15, 0]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    delay: 0.5
                                }}
                                className="absolute top-1/2 left-4 transform -translate-y-1/2"
                            >
                                <Heart className="w-4 h-4 text-red-400" />
                            </motion.div>

                            {/* Status Message */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="text-sm text-gray-500"
                            >
                                Siparişinizin durumunu <span className="font-medium text-primary-600">Siparişlerim</span> sayfasından takip edebilirsiniz.
                            </motion.p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
