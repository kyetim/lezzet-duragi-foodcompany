import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, Mail } from 'lucide-react';
import { Button } from './button';
import type { ErrorFallbackProps } from './ErrorBoundary';

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  errorInfo, 
  resetError 
}) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleReportError = () => {
    const subject = 'Lezzet Durağı - Hata Raporu';
    const body = `Merhaba,\n\nWeb sitenizde bir hata ile karşılaştım:\n\nHata: ${error?.message}\n\nTarih: ${new Date().toLocaleString('tr-TR')}\n\nEk bilgiler: Bu hata [hangi sayfada/ne yaparken] oluştu.\n\nTeşekkürler.`;
    window.open(`mailto:destek@lezzetduragi.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
            >
              <AlertTriangle className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Oops! Bir şeyler ters gitti
            </h1>
            <p className="text-orange-100">
              Lezzetli yemeklerimize ulaşırken teknik bir sorun yaşadık
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Endişelenmeyin! Bu geçici bir sorun ve ekibimiz çalışıyor. 
                Bu arada şunları deneyebilirsiniz:
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={resetError}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tekrar Dene
              </Button>

              <Button
                onClick={handleReload}
                variant="outline"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sayfayı Yenile
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </div>

            {/* Support */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center mb-3">
                Sorun devam ediyorsa bizimle iletişime geçin
              </p>
              <Button
                onClick={handleReportError}
                variant="ghost"
                className="w-full text-gray-600 hover:bg-gray-50"
                size="sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Hata Bildir
              </Button>
            </div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && error && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-6 border-t border-red-100"
              >
                <summary className="text-sm font-medium text-red-700 cursor-pointer hover:text-red-800">
                  🔧 Geliştirici Bilgileri
                </summary>
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-xs text-red-600 space-y-2">
                    <div>
                      <strong>Hata Mesajı:</strong>
                      <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto max-h-20">
                        {error.message}
                      </pre>
                    </div>
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                        {error.stack}
                      </pre>
                    </div>
                    {errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </motion.details>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-500">
            Lezzet Durağı • Her zaman yanınızda 🍽️
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};