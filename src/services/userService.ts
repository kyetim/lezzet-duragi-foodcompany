import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserAddress } from '../interfaces/user';

const ADDRESSES_COLLECTION = 'userAddresses';

export const userAddressService = {
  // Kullanıcının tüm adreslerini getir
  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    try {
      const q = query(
        collection(db, ADDRESSES_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const addresses: UserAddress[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        addresses.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as UserAddress);
      });
      
      return addresses;
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      // Firestore henüz oluşturulmamışsa boş array döndür
      if (error.code === 'unavailable' || error.code === 'permission-denied') {
        console.warn('Firestore not available, returning empty addresses array');
        return [];
      }
      throw error;
    }
  },

  // Yeni adres ekle
  async addUserAddress(userId: string, address: Omit<UserAddress, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ADDRESSES_COLLECTION), {
        ...address,
        userId,
        createdAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding user address:', error);
      // Firestore henüz oluşturulmamışsa geçici ID döndür
      if (error.code === 'unavailable' || error.code === 'permission-denied') {
        console.warn('Firestore not available, returning temporary ID');
        return `temp_${Date.now()}`;
      }
      throw error;
    }
  },

  // Adres güncelle
  async updateUserAddress(addressId: string, updates: Partial<UserAddress>): Promise<void> {
    try {
      const addressRef = doc(db, ADDRESSES_COLLECTION, addressId);
      await updateDoc(addressRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user address:', error);
      throw error;
    }
  },

  // Adres sil
  async deleteUserAddress(addressId: string): Promise<void> {
    try {
      const addressRef = doc(db, ADDRESSES_COLLECTION, addressId);
      await deleteDoc(addressRef);
    } catch (error) {
      console.error('Error deleting user address:', error);
      throw error;
    }
  },

  // Varsayılan adres ayarla
  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    try {
      // Önce tüm adresleri varsayılan olmaktan çıkar
      const userAddresses = await this.getUserAddresses(userId);
      const updatePromises = userAddresses
        .filter(addr => addr.isDefault)
        .map(addr => this.updateUserAddress(addr.id, { isDefault: false }));
      
      await Promise.all(updatePromises);
      
      // Sonra seçilen adresi varsayılan yap
      await this.updateUserAddress(addressId, { isDefault: true });
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }
};
