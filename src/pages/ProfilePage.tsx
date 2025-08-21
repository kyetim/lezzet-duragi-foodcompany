import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { AddressManager } from '../components/profile/AddressManager';
import { AddressFormModal } from '../components/profile/AddressFormModal';
import { userAddressService } from '../services/userService';
import type { UserAddress } from '../interfaces/user';

export const ProfilePage: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  // Firebase'den gerçek verileri çek
  useEffect(() => {
    if (currentUser) {
      const fetchAddresses = async () => {
        try {
          const userAddresses = await userAddressService.getUserAddresses(currentUser.uid);
          setAddresses(userAddresses);
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      };
      
      fetchAddresses();
    }
  }, [currentUser]);

  const handleEditProfile = () => {
    // TODO: Profil düzenleme modal'ını aç
    console.log('Edit profile clicked');
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (addressData: Omit<UserAddress, 'id' | 'createdAt'>) => {
    try {
      if (editingAddress) {
        // Güncelleme
        await userAddressService.updateUserAddress(editingAddress.id, addressData);
        setAddresses(addresses.map(addr => 
          addr.id === editingAddress.id 
            ? { ...addr, ...addressData }
            : addr
        ));
      } else {
        // Yeni ekleme
        const newAddressId = await userAddressService.addUserAddress(currentUser!.uid, addressData);
        const newAddress: UserAddress = {
          id: newAddressId,
          ...addressData,
          createdAt: new Date()
        };
        setAddresses([newAddress, ...addresses]);
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await userAddressService.deleteUserAddress(addressId);
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await userAddressService.setDefaultAddress(currentUser!.uid, addressId);
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      })));
    } catch (error) {
      console.error('Error setting default address:', error);
    }
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
        </div>
      </div>

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        address={editingAddress}
      />
    </div>
  );
};
