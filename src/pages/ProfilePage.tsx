import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { AddressManager } from '../components/profile/AddressManager';
import { OrderHistory } from '../components/profile/OrderHistory';
import { UserAddress } from '../interfaces/user';
import { Order } from '../interfaces/order';

export const ProfilePage: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Mock data - gerçek uygulamada Firebase'den gelecek
  useEffect(() => {
    if (currentUser) {
      // Mock addresses
      setAddresses([
        {
          id: '1',
          title: 'Ev',
          fullName: 'John Doe',
          phone: '+90 555 123 4567',
          address: 'Atatürk Mahallesi, Cumhuriyet Caddesi No: 123',
          district: 'Kadıköy',
          city: 'İstanbul',
          postalCode: '34710',
          isDefault: true,
          createdAt: new Date()
        },
        {
          id: '2',
          title: 'İş',
          fullName: 'John Doe',
          phone: '+90 555 123 4567',
          address: 'İş Merkezi, Ofis Sokak No: 45',
          district: 'Levent',
          city: 'İstanbul',
          postalCode: '34330',
          isDefault: false,
          createdAt: new Date()
        }
      ]);

      // Mock orders
      setOrders([
        {
          id: '1',
          userId: currentUser.uid,
          orderNumber: 'LD-2024-001',
          items: [
            {
              menuItemId: '1',
              name: 'Döner Porsiyon',
              quantity: 2,
              price: 45.00,
              image: '/api/placeholder/40/40'
            },
            {
              menuItemId: '2',
              name: 'Ayran',
              quantity: 2,
              price: 8.00,
              image: '/api/placeholder/40/40'
            }
          ],
          totalAmount: 106.00,
          status: 'delivered',
          deliveryType: 'delivery',
          deliveryAddress: {
            street: 'Atatürk Mahallesi, Cumhuriyet Caddesi No: 123',
            city: 'İstanbul',
            postalCode: '34710',
            country: 'Türkiye'
          },
          createdAt: new Date(Date.now() - 86400000), // 1 gün önce
          paymentMethod: 'cash'
        },
        {
          id: '2',
          userId: currentUser.uid,
          orderNumber: 'LD-2024-002',
          items: [
            {
              menuItemId: '3',
              name: 'Mantı',
              quantity: 1,
              price: 35.00,
              image: '/api/placeholder/40/40'
            }
          ],
          totalAmount: 35.00,
          status: 'preparing',
          deliveryType: 'pickup',
          createdAt: new Date(Date.now() - 3600000), // 1 saat önce
          paymentMethod: 'card'
        }
      ]);
    }
  }, [currentUser]);

  const handleEditProfile = () => {
    // TODO: Profil düzenleme modal'ını aç
    console.log('Edit profile clicked');
  };

  const handleAddAddress = () => {
    // TODO: Adres ekleme modal'ını aç
    console.log('Add address clicked');
  };

  const handleEditAddress = (address: UserAddress) => {
    // TODO: Adres düzenleme modal'ını aç
    console.log('Edit address clicked:', address);
  };

  const handleDeleteAddress = (addressId: string) => {
    // TODO: Adres silme onayı ve işlemi
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  const handleViewOrder = (orderId: string) => {
    // TODO: Sipariş detay sayfasına yönlendir
    console.log('View order clicked:', orderId);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <ProfileHeader onEditProfile={handleEditProfile} />
          
          {/* Address Management */}
          <AddressManager
            addresses={addresses}
            onAddAddress={handleAddAddress}
            onEditAddress={handleEditAddress}
            onDeleteAddress={handleDeleteAddress}
            onSetDefault={handleSetDefaultAddress}
          />
          
          {/* Order History */}
          <OrderHistory
            orders={orders}
            onViewOrder={handleViewOrder}
            onReorder={handleReorder}
          />
        </div>
      </div>
    </div>
  );
};
