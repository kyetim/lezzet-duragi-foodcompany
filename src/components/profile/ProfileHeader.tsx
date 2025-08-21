import React from 'react';
import { User, Mail, Phone, Calendar, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileHeaderProps {
  onEditProfile: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditProfile }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const formatDate = (date: string | null) => {
    if (!date) return 'Bilinmiyor';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-primary-600" />
              )}
            </div>
            
            {/* User Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentUser.displayName || 'Kullanıcı'}
              </h1>
              <div className="space-y-2 mt-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{currentUser.email}</span>
                </div>
                {currentUser.phoneNumber && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{currentUser.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Üye olma tarihi: {formatDate(currentUser.metadata.creationTime || null)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Edit Button */}
          <Button
            onClick={onEditProfile}
            variant="outline"
            className="flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Profili Düzenle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
