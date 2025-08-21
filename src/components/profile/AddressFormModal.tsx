import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { UserAddress } from '../../interfaces/user';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<UserAddress, 'id' | 'createdAt'>) => void;
  address?: UserAddress | null;
}

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  address
}) => {
  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    phone: '',
    address: '',
    district: '',
    city: '',
    postalCode: '',
    isDefault: false
  });

  useEffect(() => {
    if (address) {
      setFormData({
        title: address.title,
        fullName: address.fullName,
        phone: address.phone,
        address: address.address,
        district: address.district,
        city: address.city,
        postalCode: address.postalCode || '',
        isDefault: address.isDefault
      });
    } else {
      setFormData({
        title: '',
        fullName: '',
        phone: '',
        address: '',
        district: '',
        city: '',
        postalCode: '',
        isDefault: false
      });
    }
  }, [address, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {address ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="title">Adres Başlığı</Label>
            <select
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Seçiniz</option>
              <option value="Ev">Ev</option>
              <option value="İş">İş</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div>
            <Label htmlFor="fullName">Ad Soyad</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Ad Soyad"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+90 555 123 4567"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Mahalle, Sokak, Bina No"
              required
            />
          </div>

          <div>
            <Label htmlFor="district">İlçe</Label>
            <Input
              id="district"
              type="text"
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              placeholder="İlçe"
              required
            />
          </div>

          <div>
            <Label htmlFor="city">Şehir</Label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Şehir"
              required
            />
          </div>

          <div>
            <Label htmlFor="postalCode">Posta Kodu</Label>
            <Input
              id="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              placeholder="34000"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isDefault"
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange('isDefault', e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <Label htmlFor="isDefault" className="text-sm">
              Varsayılan adres olarak ayarla
            </Label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              İptal
            </Button>
            <Button type="submit" className="flex-1">
              {address ? 'Güncelle' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
