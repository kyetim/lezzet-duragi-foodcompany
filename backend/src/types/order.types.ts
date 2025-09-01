import { Document, Types } from 'mongoose';
import { IUserAddress } from './user.types';

// 🛒 Order Base Interface
export interface IOrder {
  orderNumber: string; // Unique order identifier (LD-2025-00001)
  customerId: Types.ObjectId;
  
  // 📦 Order Items
  items: IOrderItem[];
  
  // 💰 Pricing
  subtotal: number; // Ürünlerin toplam fiyatı
  taxAmount: number; // KDV
  deliveryFee: number; // Teslimat ücreti
  discountAmount: number; // İndirim tutarı
  totalAmount: number; // Final ödenecek tutar
  currency: 'TRY' | 'USD' | 'EUR';
  
  // 🏷️ Discounts & Coupons
  appliedCoupons: IAppliedCoupon[];
  loyaltyPointsUsed: number;
  loyaltyPointsEarned: number;
  
  // 📍 Delivery Information
  deliveryAddress: IUserAddress;
  deliveryType: 'delivery' | 'pickup' | 'dine-in';
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  deliveryNotes?: string;
  
  // 📞 Contact Information
  contactPhone: string;
  alternativePhone?: string;
  
  // 💳 Payment Information
  paymentMethod: 'cash' | 'card' | 'online' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial';
  paymentDetails?: IPaymentDetails;
  
  // 📊 Order Status & Tracking
  status: IOrderStatus;
  statusHistory: IOrderStatusHistory[];
  
  // 👨‍💼 Staff Assignment
  assignedTo?: {
    kitchen: Types.ObjectId; // Chef/Cook
    delivery: Types.ObjectId; // Delivery person
    cashier: Types.ObjectId; // Cashier
  };
  
  // ⏰ Timing
  orderDate: Date;
  confirmedAt?: Date;
  preparedAt?: Date;
  readyAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  
  // 📝 Additional Information
  specialInstructions?: string;
  customerNotes?: string;
  internalNotes?: string; // Staff notes
  
  // 🔄 Order Management
  isPreOrder: boolean; // Önceden sipariş
  scheduledFor?: Date; // Zamanlanmış sipariş
  repeatOrder?: {
    isRecurring: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    nextOrderDate?: Date;
  };
  
  // 📊 Analytics & Feedback
  rating?: {
    overall: number; // 1-5
    food: number;
    delivery: number;
    service: number;
    comment?: string;
    ratedAt: Date;
  };
  
  // 🚨 Issues & Support
  issues?: IOrderIssue[];
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 🛍️ Order Item Interface
export interface IOrderItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  productName: string; // Snapshot ürün silinse bile
  productImage?: string;
  
  // 📏 Quantity & Pricing
  quantity: number;
  unitPrice: number; // Birim fiyat (indirimler dahil)
  originalUnitPrice: number; // Orijinal birim fiyat
  totalPrice: number; // quantity * unitPrice
  
  // 🔧 Customizations
  selectedPortion?: {
    name: string;
    priceModifier: number;
  };
  selectedCustomizations: ISelectedCustomization[];
  
  // 📝 Item Notes
  specialInstructions?: string;
  
  // 📊 Item Status
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';
  estimatedPrepTime: number; // dakika
  actualPrepTime?: number;
  
  // 📈 Analytics
  preparationStartedAt?: Date;
  preparationCompletedAt?: Date;
}

// ⚙️ Selected Customization Interface
export interface ISelectedCustomization {
  _id?: Types.ObjectId;
  customizationId: Types.ObjectId;
  customizationName: string;
  selectedOptions: {
    optionId: Types.ObjectId;
    optionName: string;
    priceModifier: number;
  }[];
  totalPriceModifier: number;
}

// 🏷️ Applied Coupon Interface
export interface IAppliedCoupon {
  _id?: Types.ObjectId;
  couponCode: string;
  couponName: string;
  discountType: 'percentage' | 'fixed' | 'free-delivery';
  discountValue: number;
  discountAmount: number; // Gerçek indirim tutarı
  appliedAt: Date;
}

// 💳 Payment Details Interface
export interface IPaymentDetails {
  transactionId?: string;
  paymentGateway?: 'stripe' | 'iyzico' | 'paytr';
  cardLastFour?: string;
  cardBrand?: string;
  paymentIntentId?: string;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  paidAt?: Date;
  refundedAt?: Date;
}

// 📊 Order Status Enum
export type IOrderStatus = 
  | 'pending'        // Sipariş alındı, onay bekleniyor
  | 'confirmed'      // Sipariş onaylandı
  | 'preparing'      // Hazırlanıyor
  | 'ready'          // Hazır (pickup için)
  | 'out-for-delivery' // Yolda (delivery için)
  | 'delivered'      // Teslim edildi
  | 'completed'      // Tamamlandı
  | 'cancelled'      // İptal edildi
  | 'refunded';      // İade edildi

// 📈 Order Status History Interface
export interface IOrderStatusHistory {
  _id?: Types.ObjectId;
  status: IOrderStatus;
  timestamp: Date;
  updatedBy?: Types.ObjectId; // Staff member
  reason?: string;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// 🚨 Order Issue Interface
export interface IOrderIssue {
  _id?: Types.ObjectId;
  type: 'missing-item' | 'wrong-item' | 'cold-food' | 'late-delivery' | 'poor-quality' | 'other';
  description: string;
  reportedBy: 'customer' | 'staff';
  reportedAt: Date;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution?: string;
  resolvedBy?: Types.ObjectId;
  resolvedAt?: Date;
  compensationOffered?: {
    type: 'refund' | 'credit' | 'reorder' | 'discount';
    amount?: number;
    description: string;
  };
}

// 🌟 Combined Order Document Interface (Mongoose Document)
export interface IOrderDocument extends IOrder, Document {
  _id: Types.ObjectId;
  
  // 🔧 Instance Methods
  calculateTotals(): Promise<void>;
  updateStatus(newStatus: IOrderStatus, updatedBy?: Types.ObjectId, reason?: string): Promise<void>;
  addIssue(issue: Omit<IOrderIssue, '_id' | 'reportedAt'>): Promise<void>;
  canBeCancelled(): boolean;
  canBeRefunded(): boolean;
  getEstimatedDeliveryTime(): Date;
  
  // 💰 Payment methods
  markAsPaid(paymentDetails: IPaymentDetails): Promise<void>;
  processRefund(amount: number, reason: string): Promise<void>;
  
  // 📊 Analytics methods
  getPreparationTime(): number | null;
  getDeliveryTime(): number | null;
  getTotalTime(): number | null;
}

// 🔍 Order Query Helpers
export interface IOrderQuery {
  findByCustomer(customerId: Types.ObjectId): Promise<IOrderDocument[]>;
  findByStatus(status: IOrderStatus): Promise<IOrderDocument[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<IOrderDocument[]>;
  findPending(): Promise<IOrderDocument[]>;
  findActiveOrders(): Promise<IOrderDocument[]>;
  searchByOrderNumber(orderNumber: string): Promise<IOrderDocument | null>;
}

// 🆕 Order Creation Interface
export interface IOrderCreateInput {
  customerId: Types.ObjectId;
  items: Omit<IOrderItem, '_id' | 'status' | 'estimatedPrepTime'>[];
  deliveryAddress: IUserAddress;
  deliveryType: 'delivery' | 'pickup' | 'dine-in';
  contactPhone: string;
  paymentMethod: 'cash' | 'card' | 'online' | 'wallet';
  specialInstructions?: string;
  customerNotes?: string;
  scheduledFor?: Date;
  appliedCoupons?: string[]; // Coupon codes
  loyaltyPointsToUse?: number;
}

// 📊 Order Analytics Interface
export interface IOrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  
  // 📈 Trends
  orderTrends: {
    period: string;
    orderCount: number;
    revenue: number;
  }[];
  
  // 🕐 Peak Hours
  peakHours: {
    hour: number;
    orderCount: number;
  }[];
  
  // 🏆 Popular Items
  popularItems: {
    productId: Types.ObjectId;
    productName: string;
    orderCount: number;
    revenue: number;
  }[];
  
  // 📍 Delivery Areas
  deliveryAreas: {
    district: string;
    orderCount: number;
    averageDeliveryTime: number;
  }[];
  
  // 📊 Status Distribution
  statusDistribution: {
    status: IOrderStatus;
    count: number;
    percentage: number;
  }[];
  
  // ⏱️ Performance Metrics
  averagePreparationTime: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  customerSatisfactionRate: number;
}

// 🔍 Order Search/Filter Interface
export interface IOrderSearchFilters {
  customerId?: Types.ObjectId;
  status?: IOrderStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  deliveryType?: ('delivery' | 'pickup' | 'dine-in')[];
  paymentMethod?: ('cash' | 'card' | 'online' | 'wallet')[];
  paymentStatus?: ('pending' | 'paid' | 'failed' | 'refunded')[];
  amountRange?: {
    min?: number;
    max?: number;
  };
  assignedTo?: Types.ObjectId;
  hasIssues?: boolean;
  search?: string; // Order number, customer name, phone
}

// 📄 Order List Response Interface
export interface IOrderListResponse {
  orders: IOrderDocument[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  analytics: {
    totalRevenue: number;
    averageOrderValue: number;
    statusCounts: { [key in IOrderStatus]: number };
  };
}
