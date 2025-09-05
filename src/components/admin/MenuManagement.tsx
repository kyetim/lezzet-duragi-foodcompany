import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MenuManagement() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Menü Yönetimi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Menü yönetimi özelliği geliştiriliyor...
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900">Gelecek Özellikler:</h4>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• Ürün ekleme/düzenleme/silme</li>
              <li>• Kategori yönetimi</li>
              <li>• Fiyat güncelleme</li>
              <li>• Stok takibi</li>
              <li>• Ürün görselleri yönetimi</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
