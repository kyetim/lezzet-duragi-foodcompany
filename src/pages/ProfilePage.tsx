import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { AddressManager } from '../components/profile/AddressManager';
import { AddressFormModal } from '../components/profile/AddressFormModal';
import { ProfileEditModal } from '../components/profile/ProfileEditModal';
import { userAddressService } from '../services/userService';
import { profileService } from '../services/profileService';
import type { UserAddress } from '../interfaces/user';

export const ProfilePage: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const toast = useToast();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  // Firebase'den gerçek verileri çek
  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          // Adresleri getir
          const userAddresses = await userAddressService.getUserAddresses(currentUser.uid);
          setAddresses(userAddresses);
          
          // Kullanıcı profil bilgilerini getir
          try {
            const profile = await profileService.getUserProfile(currentUser.uid);
            setUserProfile(profile);
          } catch (error) {
            console.log('User profile not found, using Auth data');
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      fetchData();
    }
  }, [currentUser]);

  const handleEditProfile = () => {
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = async (profileData: any) => {
    try {
      if (currentUser) {
        await profileService.updateProfile(currentUser, profileData);
        // Profil bilgilerini güncelle
        setUserProfile((prev: any) => ({
          ...prev,
          ...profileData,
          updatedAt: new Date()
        }));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  const handlePasswordChange = async (passwordData: any) => {
    try {
      if (currentUser) {
        await profileService.changePassword(currentUser, passwordData);
        // Başarılı şifre değişikliği sonrası kullanıcıyı bilgilendir
        toast.success('Şifre Değiştirildi', 'Şifreniz başarıyla değiştirildi!');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Şifre Değiştirme Hatası', 'Şifre değiştirilirken bir hata oluştu.');
      throw error;
    }
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
      toast.error('Adres Kaydetme Hatası', 'Adres kaydedilirken bir hata oluştu.');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await userAddressService.deleteUserAddress(addressId);
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Adres Silme Hatası', 'Adres silinirken bir hata oluştu.');
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
      toast.error('Varsayılan Adres Hatası', 'Varsayılan adres ayarlanırken bir hata oluştu.');
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
          <ProfileHeader onEditProfile={handleEditProfile} userProfile={userProfile} />
          
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

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        onPasswordChange={handlePasswordChange}
        user={currentUser}
      />
    </div>
  );
};
