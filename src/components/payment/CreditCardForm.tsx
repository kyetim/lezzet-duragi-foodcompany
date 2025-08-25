import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CreditCard, Lock, AlertCircle, TestTube } from 'lucide-react';

interface CreditCardFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
  isLoading?: boolean;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  isLoading = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMockMode = import.meta.env.VITE_USE_MOCK_PAYMENTS === 'true';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // If in mock mode, simulate payment without Stripe
      if (isMockMode) {
        console.log('🔧 Mock modu: Ödeme yöntemi oluşturma simüle ediliyor');
        
        // Create a mock payment method
        const mockPaymentMethod = {
          id: `pm_mock_${Math.random().toString(36).substr(2, 9)}`,
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242'
          }
        };
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onPaymentSuccess(mockPaymentMethod);
        return;
      }

      // Real Stripe implementation
      if (!stripe || !elements) {
        throw new Error('Stripe not loaded. Please refresh the page.');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card information not found');
      }

      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentError) {
        throw new Error(paymentError.message || 'Payment error');
      }

      onPaymentSuccess(paymentMethod);
    } catch (err: any) {
      setError(err.message);
      onPaymentError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Kredi Kartı ile Ödeme
          </div>
          {isMockMode && (
            <div className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              <TestTube className="w-3 h-3 mr-1" />
              Test Mode
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isMockMode ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Test Mode - Simulated Payment
              </label>
              <div className="border border-blue-300 rounded-lg p-4 bg-blue-50">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">🔧 Mock Payment Mode Active</p>
                  <p>• No real payment will be processed</p>
                  <p>• Payment will be simulated successfully</p>
                  <p>• Use this for testing the payment flow</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Kart Bilgileri
              </label>
              <div className="border border-gray-300 rounded-lg p-3">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Ödenecek Tutar:</span>
              <span className="font-semibold text-lg">₺{amount.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={(!stripe && !isMockMode) || processing || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {processing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                İşleniyor...
              </div>
            ) : (
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                ₺{amount.toFixed(2)} Öde
              </div>
            )}
          </Button>

          <div className="flex items-center justify-center text-xs text-gray-500">
            <Lock className="w-3 h-3 mr-1" />
            SSL ile güvenli ödeme
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
