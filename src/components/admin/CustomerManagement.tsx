import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  MapPin,
  Search,
  Filter,
  Eye,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { orderFirebaseService } from '@/services/orderFirebaseService';

interface Customer {
  id: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: Date;
  metadata: {
    creationTime: string;
    lastSignInTime?: string;
  };
  // Calculated fields
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  averageOrderValue: number;
}

interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
  activeCustomers: number;
  averageOrderValue: number;
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customerStats, setCustomerStats] = useState<CustomerStats>({
    totalCustomers: 0,
    newThisMonth: 0,
    activeCustomers: 0,
    averageOrderValue: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Real-time listener for orders to calculate customer data
  useEffect(() => {
    console.log('🔄 Setting up customer management listeners...');

    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef);

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const allOrders: any[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isTestOrder) return; // Skip test orders

        allOrders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        });
      });

      setOrders(allOrders);

      // Calculate customer data from orders
      const customerMap = new Map<string, Customer>();

      allOrders.forEach(order => {
        const customerId = order.userId;

        if (!customerMap.has(customerId)) {
          customerMap.set(customerId, {
            id: customerId,
            email: order.customerEmail || 'email@example.com',
            displayName: order.customerName || 'Anonim Kullanıcı',
            phoneNumber: order.customerPhone,
            createdAt: (() => {
              try {
                if (order.createdAt?.toDate) {
                  return order.createdAt.toDate();
                } else if (order.createdAt) {
                  const date = new Date(order.createdAt);
                  return isNaN(date.getTime()) ? new Date() : date;
                } else {
                  return new Date();
                }
              } catch (error) {
                return new Date();
              }
            })(),
            metadata: {
              creationTime: (() => {
                try {
                  if (order.createdAt?.toDate) {
                    return order.createdAt.toDate().toISOString();
                  } else if (order.createdAt) {
                    const date = new Date(order.createdAt);
                    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
                  } else {
                    return new Date().toISOString();
                  }
                } catch (error) {
                  console.warn('Invalid date in customer creation:', order.createdAt, error);
                  return new Date().toISOString();
                }
              })()
            },
            totalOrders: 0,
            totalSpent: 0,
            averageOrderValue: 0
          });
        }

        const customer = customerMap.get(customerId)!;
        customer.totalOrders++;
        customer.totalSpent += order.total || 0;
        customer.averageOrderValue = customer.totalSpent / customer.totalOrders;

        if (!customer.lastOrderDate || order.createdAt > customer.lastOrderDate) {
          customer.lastOrderDate = order.createdAt;
        }
      });

      const customerList = Array.from(customerMap.values())
        .sort((a, b) => b.totalSpent - a.totalSpent);

      setCustomers(customerList);

      // Calculate stats
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const activeThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

      const newThisMonth = customerList.filter(c => c.createdAt >= thisMonth).length;
      const activeCustomers = customerList.filter(c =>
        c.lastOrderDate && c.lastOrderDate >= activeThreshold
      ).length;
      const totalOrderValue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const averageOrderValue = allOrders.length > 0 ? totalOrderValue / allOrders.length : 0;

      setCustomerStats({
        totalCustomers: customerList.length,
        newThisMonth,
        activeCustomers,
        averageOrderValue
      });

      setIsLoading(false);
      console.log('👥 Customer data updated:', customerList.length, 'customers');
    });

    return () => {
      console.log('🔚 Cleaning up customer management listeners');
      unsubscribe();
    };
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber?.includes(searchTerm)
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCustomerSegment = (customer: Customer) => {
    if (customer.totalSpent > 500) return { label: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (customer.totalSpent > 200) return { label: 'Sadık', color: 'bg-blue-100 text-blue-800' };
    if (customer.totalOrders > 5) return { label: 'Düzenli', color: 'bg-green-100 text-green-800' };
    return { label: 'Yeni', color: 'bg-gray-100 text-gray-800' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customerStats.totalCustomers}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bu Ay Yeni</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customerStats.newThisMonth}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customerStats.activeCustomers}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ort. Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{customerStats.averageOrderValue.toFixed(0)}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Müşteri Listesi
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Müşteri ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Müşteri</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">İletişim</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Sipariş</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Toplam</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Segment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Son Sipariş</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Arama kriterlerine uygun müşteri bulunamadı' : 'Henüz müşteri bulunmuyor'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => {
                    const segment = getCustomerSegment(customer);

                    return (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {customer.photoURL ? (
                                <img
                                  src={customer.photoURL}
                                  alt={customer.displayName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <Users className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {customer.displayName || 'Anonim Kullanıcı'}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {customer.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900">{customer.email}</span>
                            </div>
                            {customer.phoneNumber && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{customer.phoneNumber}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{customer.totalOrders}</p>
                            <p className="text-xs text-gray-500">adet</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">₺{customer.totalSpent.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">
                              Ort: ₺{customer.averageOrderValue.toFixed(0)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${segment.color}`}>
                            {segment.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900">
                            {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : '-'}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}