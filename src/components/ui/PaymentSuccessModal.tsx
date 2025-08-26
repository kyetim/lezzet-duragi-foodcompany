import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  X, 
  Package, 
  Clock, 
  MapPin,
  CreditCard,
  Star,
  Sparkles
} from 'lucide-react';
import { Button } from './button';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string;
  totalAmount: number;
  paymentMethod: string;
  estimatedDeliveryTime?: Date;
  deliveryAddress?: {
    fullName: string;
    address: string;
    district: string;
    city: string;
  };
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  totalAmount,
  paymentMethod,
  estimatedDeliveryTime,
  deliveryAddress
}) => {
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.3
            }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Animation */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.2, 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10 
                }}
                className="relative inline-block mb-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" fill="currentColor" />
                </div>
                
                {/* Sparkle animations */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.5
                  }}
                  className="absolute -bottom-1 -left-1"
                >
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Ödeme Başarılı! 🎉
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600"
              >
                Siparişiniz başarıyla alındı ve hazırlanmaya başlandı.
              </motion.p>
            </div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 mb-6"
            >
              {/* Order Number */}
              {orderNumber && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Sipariş No</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-gray-900">
                    #{orderNumber.slice(-8).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Total Amount */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <span className="text-sm font-medium text-gray-700 block">Ödenen Tutar</span>
                    <span className="text-xs text-gray-500">{paymentMethod}</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-green-600">
                  ₺{totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Estimated Delivery Time */}
              {estimatedDeliveryTime && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Tahmini Teslimat</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    ~{formatTime(estimatedDeliveryTime)}
                  </span>
                </div>
              )}

              {/* Delivery Address */}
              {deliveryAddress && (
                <div className="p-3 bg-orange-50 rounded-xl">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700 block mb-1">
                        Teslimat Adresi
                      </span>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{deliveryAddress.fullName}</div>
                        <div>{deliveryAddress.address}</div>
                        <div>{deliveryAddress.district}, {deliveryAddress.city}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Rating Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl mb-6"
            >
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Deneyiminizi değerlendirin
                </span>
              </div>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className="w-6 h-6 text-yellow-400 hover:text-yellow-500" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Devam Et
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
              >
                Siparişlerimi Görüntüle
              </Button>
            </motion.div>

            {/* Thank You Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-sm text-gray-500 mt-6"
            >
              Lezzet Durağı'nı tercih ettiğiniz için teşekkürler! 🍽️
            </motion.p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};