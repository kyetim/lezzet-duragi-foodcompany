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
import type { Order } from '../interfaces/order';

const ORDERS_COLLECTION = 'orders';

export const orderService = {
  // Kullanıcının tüm siparişlerini getir
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      // Önce sadece userId ile filtrele, sonra client-side'da sırala
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || undefined,
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || undefined
        } as Order);
      });
      
      // Client-side'da createdAt'e göre sırala
      return orders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching user orders:', error);
      // Firestore henüz oluşturulmamışsa boş array döndür
      if (error.code === 'unavailable' || error.code === 'permission-denied') {
        console.warn('Firestore not available, returning empty orders array');
        return [];
      }
      throw error;
    }
  },

  // Sipariş detayını getir
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (orderSnap.exists()) {
        const data = orderSnap.data();
        return {
          id: orderSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || undefined,
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate() || undefined
        } as Order;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Yeni sipariş oluştur
  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Sipariş güncelle
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Sipariş sil
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await deleteDoc(orderRef);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Sipariş durumunu güncelle
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      await this.updateOrder(orderId, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};
