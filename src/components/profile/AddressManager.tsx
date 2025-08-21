import React, { useState } from 'react';
import { Plus, MapPin, Edit, Trash2, Home, Building, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { UserAddress } from '../../interfaces/user';

interface AddressManagerProps {
  addresses: UserAddress[];
  onAddAddress: () => void;
  onEditAddress: (address: UserAddress) => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

export const AddressManager: React.FC<AddressManagerProps> = ({
  addresses,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onSetDefault
}) => {
  const getAddressIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'ev':
        return <Home className="w-5 h-5 text-primary-600" />;
      case 'iş':
        return <Building className="w-5 h-5 text-primary-600" />;
      default:
        return <MapPin className="w-5 h-5 text-primary-600" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Adreslerim</CardTitle>
          <CardDescription>
            Teslimat adreslerinizi yönetin
          </CardDescription>
        </div>
        <Button onClick={onAddAddress} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Adres
        </Button>
      </CardHeader>
      
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Henüz kayıtlı adresiniz yok</p>
            <Button onClick={onAddAddress} variant="outline">
              İlk Adresinizi Ekleyin
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-lg p-4 ${
                  address.isDefault ? 'border-primary-200 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAddressIcon(address.title)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {address.title}
                        </h3>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                            Varsayılan
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {address.fullName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.phone}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.address}, {address.district}, {address.city}
                        {address.postalCode && ` ${address.postalCode}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!address.isDefault && (
                      <Button
                        onClick={() => onSetDefault(address.id)}
                        variant="outline"
                        size="sm"
                      >
                        Varsayılan Yap
                      </Button>
                    )}
                    <Button
                      onClick={() => onEditAddress(address)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDeleteAddress(address.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
