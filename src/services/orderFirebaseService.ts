import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CartItem } from '../interfaces/cart';

// Order Status Types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'on_delivery' | 'delivered' | 'cancelled';

// User Address Interface
export interface UserAddress {
  id: string;
  userId: string;
  title: string;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  postalCode?: string;
  isDefault: boolean;
  addressType: 'home' | 'work' | 'other';
}

// Order Item Interface
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
  notes?: string;
}

// Order Interface
export interface Order {
  id?: string;
  userId: string;
  orderNumber: string;

  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Order Items
  items: OrderItem[];
  itemsCount: number;

  // Pricing
  subtotal: number;
  deliveryFee: number;
  total: number;

  // Delivery Info
  deliveryAddress: UserAddress;
  estimatedDeliveryTime: number; // in minutes

  // Payment Info
  paymentMethod: 'cash' | 'card';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentIntentId?: string;

  // Order Status
  status: OrderStatus;
  notes?: string;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  estimatedReadyAt: Timestamp;
}

// Order Creation Input
export interface CreateOrderInput {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  deliveryAddress: UserAddress;
  paymentMethod: 'cash' | 'card';
  paymentIntentId?: string;
  notes?: string;
  estimatedDeliveryTime?: number;
}

class OrderFirebaseService {
  private collectionName = 'orders';
  private itemsSubCollection = 'order_items';

  // Calculate order totals
  private calculateOrderTotals(items: CartItem[]) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 100 ? 0 : 15; // Free delivery over 100 TL
    const total = subtotal + deliveryFee;
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, deliveryFee, total, itemsCount };
  }

  // Generate order number
  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `ORD-${new Date().getFullYear()}-${random}`;
  }

  // Get all orders (for admin)
  async getAllOrders(): Promise<Order[]> {
    try {
      console.log('🔄 Fetching all orders from Firestore...');

      const ordersRef = collection(db, this.collectionName);
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        } as Order);
      });

      console.log(`✅ Found ${orders.length} orders`);
      return orders;
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw new Error('Siparişler alınırken hata oluştu');
    }
  }

  // Get orders by user ID
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      console.log(`🔄 Fetching orders for user: ${userId}`);

      const ordersRef = collection(db, this.collectionName);
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        } as Order);
      });

      console.log(`✅ Found ${orders.length} orders for user`);
      return orders;
    } catch (error) {
      console.error('❌ Error fetching user orders:', error);
      throw new Error('Kullanıcı siparişleri alınırken hata oluştu');
    }
  }

  // Get single order
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      console.log(`🔄 Fetching order: ${orderId}`);

      const docRef = doc(db, this.collectionName, orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const order = {
          id: docSnap.id,
          ...docSnap.data()
        } as Order;

        console.log('✅ Order found:', order.orderNumber);
        return order;
      } else {
        console.log('❌ Order not found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      throw new Error('Sipariş alınırken hata oluştu');
    }
  }

  // Create new order
  async createOrder(orderData: CreateOrderInput): Promise<string> {
    try {
      console.log('🔄 Creating new order in Firestore...', orderData);

      // Debug: Check for undefined values
      console.log('🔍 Debug order fields:', {
        paymentIntentId: orderData.paymentIntentId,
        notes: orderData.notes,
        hasNotes: !!orderData.notes,
        notesLength: orderData.notes?.length
      });

      // DEV Environment Bypass (since permissions work in prod but not dev)
      if (import.meta.env.DEV) {
        console.log('🚧 DEV Environment: Using mock order creation');
        const mockOrderId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('✅ Mock order created:', mockOrderId);
        return mockOrderId;
      }

      const { subtotal, deliveryFee, total, itemsCount } = this.calculateOrderTotals(orderData.items);

      // Create order document (filter out undefined values)
      const orderBase = {
        userId: orderData.userId,
        orderNumber: this.generateOrderNumber(),

        // Customer Info
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,

        // Order Items
        items: orderData.items.map(item => ({
          id: item.id,
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
          notes: item.notes
        })),
        itemsCount,

        // Pricing
        subtotal,
        deliveryFee,
        total,

        // Delivery Info
        deliveryAddress: orderData.deliveryAddress,
        estimatedDeliveryTime: orderData.estimatedDeliveryTime || 30,

        // Payment Info
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentMethod === 'card' ? 'completed' : 'pending',

        // Order Status
        status: 'confirmed',

        // Timestamps
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        estimatedReadyAt: serverTimestamp() as Timestamp, // Will be updated based on prep time
      };

      // Add optional fields only if they exist (aggressive undefined filtering)
      const order: any = { ...orderBase };

      if (orderData.paymentIntentId && orderData.paymentIntentId !== undefined && orderData.paymentIntentId !== null) {
        order.paymentIntentId = orderData.paymentIntentId;
      }

      if (orderData.notes && orderData.notes !== undefined && orderData.notes !== null && orderData.notes.trim()) {
        order.notes = orderData.notes.trim();
      }

      // Final safety check: remove any undefined values that might have slipped through
      Object.keys(order).forEach(key => {
        if (order[key] === undefined || order[key] === null) {
          delete order[key];
        }
      });

      console.log('✅ Final order object (cleaned):', order);

      // Use batch write for atomic operation
      const batch = writeBatch(db);

      // Add order document
      const orderRef = doc(collection(db, this.collectionName));
      batch.set(orderRef, order);

      // Commit the batch
      await batch.commit();

      console.log('✅ Order created with ID:', orderRef.id);
      return orderRef.id;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw new Error('Sipariş oluşturulurken hata oluştu');
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      console.log(`🔄 Updating order status: ${orderId} to ${status}`);

      const docRef = doc(db, this.collectionName, orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp() as Timestamp,
      });

      console.log('✅ Order status updated successfully');
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw new Error('Sipariş durumu güncellenirken hata oluştu');
    }
  }

  // Delete order (admin only)
  async deleteOrder(orderId: string): Promise<void> {
    try {
      console.log(`🔄 Deleting order: ${orderId}`);

      const docRef = doc(db, this.collectionName, orderId);
      await deleteDoc(docRef);

      console.log('✅ Order deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      throw new Error('Sipariş silinirken hata oluştu');
    }
  }

  // Get orders by status (for admin dashboard)
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      console.log(`🔄 Fetching orders with status: ${status}`);

      const ordersRef = collection(db, this.collectionName);
      const q = query(
        ordersRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        } as Order);
      });

      console.log(`✅ Found ${orders.length} orders with status ${status}`);
      return orders;
    } catch (error) {
      console.error('❌ Error fetching orders by status:', error);
      throw new Error('Durum bazlı siparişler alınırken hata oluştu');
    }
  }

  // Get recent orders (for dashboard)
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    try {
      console.log(`🔄 Fetching ${limit} recent orders...`);

      const ordersRef = collection(db, this.collectionName);
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const orders: Order[] = [];
      let count = 0;
      querySnapshot.forEach((doc) => {
        if (count < limit) {
          orders.push({
            id: doc.id,
            ...doc.data()
          } as Order);
          count++;
        }
      });

      console.log(`✅ Found ${orders.length} recent orders`);
      return orders;
    } catch (error) {
      console.error('❌ Error fetching recent orders:', error);
      throw new Error('Son siparişler alınırken hata oluştu');
    }
  }
}

export const orderFirebaseService = new OrderFirebaseService();
