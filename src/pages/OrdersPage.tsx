import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { OrderHistory } from '../components/profile/OrderHistory';
import { orderService } from '../services/orderService';
import type { Order, UserAddress } from '../interfaces/order';

export const OrdersPage: React.FC = () => {
    const { currentUser, loading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

      // Firebase'den gerçek verileri çek
  useEffect(() => {
    if (currentUser) {
      const fetchOrders = async () => {
        try {
          const userOrders = await orderService.getUserOrders(currentUser.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
      
      fetchOrders();
    }
  }, [currentUser]);

    const handleViewOrder = (orderId: string) => {
        navigate(`/orders/${orderId}`);
    };

    const handleReorder = (orderId: string) => {
        // TODO: Sipariş yenileme işlemi
        console.log('Reorder clicked:', orderId);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Sipariş Geçmişi</h1>
                    <p className="text-gray-600 mt-2">
                        Tüm siparişlerinizi görüntüleyin ve yönetin
                    </p>
                </div>

                <OrderHistory
                    orders={orders}
                    onViewOrder={handleViewOrder}
                    onReorder={handleReorder}
                />
            </div>
        </div>
    );
};
