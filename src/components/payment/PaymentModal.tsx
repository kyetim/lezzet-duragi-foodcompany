import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { StripeProvider } from './StripeProvider';
import { CreditCardForm } from './CreditCardForm';
import { paymentService } from '../../services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentSuccess = async (paymentMethod: any) => {
    setIsLoading(true);
    try {
      // Ödeme niyeti oluştur
      const paymentIntent = await paymentService.createPaymentIntent(amount);
      
      // Ödemeyi onayla
      const result = await paymentService.confirmPayment(
        paymentIntent.clientSecret,
        paymentMethod
      );

      onPaymentSuccess(result);
      onClose();
    } catch (error: any) {
      onPaymentError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Ödeme</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <StripeProvider>
          <CreditCardForm
            amount={amount}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={onPaymentError}
            isLoading={isLoading}
          />
        </StripeProvider>
      </div>
    </div>
  );
};
