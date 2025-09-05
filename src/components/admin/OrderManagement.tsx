import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function OrderManagement() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Sipariş Yönetimi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Sipariş yönetimi özelliği geliştiriliyor...
          </p>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900">Gelecek Özellikler:</h4>
            <ul className="mt-2 text-sm text-green-800 space-y-1">
              <li>• Gelen siparişler listesi</li>
              <li>• Sipariş durumu güncelleme</li>
              <li>• Müşteri bilgileri görüntüleme</li>
              <li>• Sipariş geçmişi</li>
              <li>• Teslimat takibi</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
