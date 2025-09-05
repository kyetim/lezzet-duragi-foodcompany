import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Sistem Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Sistem ayarları özelliği geliştiriliyor...
          </p>
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900">Gelecek Özellikler:</h4>
            <ul className="mt-2 text-sm text-gray-800 space-y-1">
              <li>• Restoran bilgileri</li>
              <li>• Çalışma saatleri</li>
              <li>• Teslimat ayarları</li>
              <li>• Ödeme yöntemleri</li>
              <li>• Bildirim tercihleri</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
