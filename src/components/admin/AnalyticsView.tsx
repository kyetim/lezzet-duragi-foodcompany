import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AnalyticsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Raporlar & Analitik</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Analitik ve raporlama özelliği geliştiriliyor...
          </p>
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-medium text-orange-900">Gelecek Özellikler:</h4>
            <ul className="mt-2 text-sm text-orange-800 space-y-1">
              <li>• Günlük/haftalık satış raporları</li>
              <li>• Popüler ürünler analizi</li>
              <li>• Müşteri davranış analizi</li>
              <li>• Gelir grafikleri</li>
              <li>• Performans metrikleri</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
