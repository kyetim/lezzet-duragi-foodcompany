import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CustomerManagement() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Müşteri Yönetimi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Müşteri yönetimi özelliği geliştiriliyor...
          </p>
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-medium text-purple-900">Gelecek Özellikler:</h4>
            <ul className="mt-2 text-sm text-purple-800 space-y-1">
              <li>• Müşteri listesi ve profilleri</li>
              <li>• Sipariş geçmişi analizi</li>
              <li>• Müşteri istatistikleri</li>
              <li>• Sadakat programı</li>
              <li>• İletişim yönetimi</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
