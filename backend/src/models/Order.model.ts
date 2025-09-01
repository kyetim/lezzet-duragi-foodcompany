import mongoose, { Schema, Model } from 'mongoose';
import { 
  IOrderDocument, 
  IOrderQuery, 
  IOrderItem,
  IOrderStatus,
  IOrderStatusHistory,
  ISelectedCustomization,
  IAppliedCoupon,
  IPaymentDetails,
  IOrderIssue,
  IOrderCreateInput
} from '../types/order.types';
import { IUserAddress } from '../types/user.types';

// 📦 Order Item Schema
const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Ürün ID gereklidir']
  },
  productName: {
    type: String,
    required: [true, 'Ürün adı gereklidir'],
    trim: true
  },
  productImage: String,
  
  quantity: {
    type: Number,
    required: [true, 'Miktar gereklidir'],
    min: [1, 'Miktar en az 1 olmalıdır']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Birim fiyat gereklidir'],
    min: [0, 'Birim fiyat negatif olamaz']
  },
  originalUnitPrice: {
    type: Number,
    required: [true, 'Orijinal birim fiyat gereklidir'],
    min: [0, 'Orijinal birim fiyat negatif olamaz']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Toplam fiyat gereklidir'],
    min: [0, 'Toplam fiyat negatif olamaz']
  },
  
  selectedPortion: {
    name: String,
    priceModifier: {
      type: Number,
      default: 0
    }
  },
  
  selectedCustomizations: [{
    customizationId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    customizationName: {
      type: String,
      required: true
    },
    selectedOptions: [{
      optionId: {
        type: Schema.Types.ObjectId,
        required: true
      },
      optionName: {
        type: String,
        required: true
      },
      priceModifier: {
        type: Number,
        default: 0
      }
    }],
    totalPriceModifier: {
      type: Number,
      default: 0
    }
  }],
  
  specialInstructions: {
    type: String,
    maxlength: [500, 'Özel talimat en fazla 500 karakter olabilir']
  },
  
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'preparing', 'ready', 'served'],
      message: 'Geçersiz item durumu'
    },
    default: 'pending'
  },
  estimatedPrepTime: {
    type: Number,
    required: [true, 'Tahmini hazırlık süresi gereklidir'],
    min: [1, 'Hazırlık süresi en az 1 dakika olmalıdır']
  },
  actualPrepTime: Number,
  preparationStartedAt: Date,
  preparationCompletedAt: Date
}, { _id: true });

// 🏷️ Applied Coupon Schema
const appliedCouponSchema = new Schema<IAppliedCoupon>({
  couponCode: {
    type: String,
    required: [true, 'Kupon kodu gereklidir'],
    uppercase: true,
    trim: true
  },
  couponName: {
    type: String,
    required: [true, 'Kupon adı gereklidir'],
    trim: true
  },
  discountType: {
    type: String,
    required: [true, 'İndirim tipi gereklidir'],
    enum: {
      values: ['percentage', 'fixed', 'free-delivery'],
      message: 'Geçersiz indirim tipi'
    }
  },
  discountValue: {
    type: Number,
    required: [true, 'İndirim değeri gereklidir'],
    min: [0, 'İndirim değeri negatif olamaz']
  },
  discountAmount: {
    type: Number,
    required: [true, 'İndirim tutarı gereklidir'],
    min: [0, 'İndirim tutarı negatif olamaz']
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

// 💳 Payment Details Schema
const paymentDetailsSchema = new Schema<IPaymentDetails>({
  transactionId: String,
  paymentGateway: {
    type: String,
    enum: ['stripe', 'iyzico', 'paytr']
  },
  cardLastFour: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^\d{4}$/.test(v);
      },
      message: 'Kart son 4 hanesi geçersiz'
    }
  },
  cardBrand: String,
  paymentIntentId: String,
  refundId: String,
  refundAmount: {
    type: Number,
    min: [0, 'İade tutarı negatif olamaz']
  },
  refundReason: String,
  paidAt: Date,
  refundedAt: Date
}, { _id: false });

// 📊 Order Status History Schema
const orderStatusHistorySchema = new Schema<IOrderStatusHistory>({
  status: {
    type: String,
    required: [true, 'Durum gereklidir'],
    enum: {
      values: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'completed', 'cancelled', 'refunded'],
      message: 'Geçersiz sipariş durumu'
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: String,
  notes: {
    type: String,
    maxlength: [500, 'Not en fazla 500 karakter olabilir']
  },
  location: {
    latitude: {
      type: Number,
      min: [-90, 'Geçersiz enlem'],
      max: [90, 'Geçersiz enlem']
    },
    longitude: {
      type: Number,
      min: [-180, 'Geçersiz boylam'],
      max: [180, 'Geçersiz boylam']
    }
  }
}, { _id: true });

// 🚨 Order Issue Schema
const orderIssueSchema = new Schema<IOrderIssue>({
  type: {
    type: String,
    required: [true, 'Sorun tipi gereklidir'],
    enum: {
      values: ['missing-item', 'wrong-item', 'cold-food', 'late-delivery', 'poor-quality', 'other'],
      message: 'Geçersiz sorun tipi'
    }
  },
  description: {
    type: String,
    required: [true, 'Sorun açıklaması gereklidir'],
    maxlength: [1000, 'Açıklama en fazla 1000 karakter olabilir']
  },
  reportedBy: {
    type: String,
    required: [true, 'Rapor eden gereklidir'],
    enum: {
      values: ['customer', 'staff'],
      message: 'Geçersiz rapor eden tipi'
    }
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'investigating', 'resolved', 'closed'],
      message: 'Geçersiz sorun durumu'
    },
    default: 'open'
  },
  resolution: String,
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  compensationOffered: {
    type: {
      type: String,
      enum: ['refund', 'credit', 'reorder', 'discount']
    },
    amount: {
      type: Number,
      min: [0, 'Kompanzasyon tutarı negatif olamaz']
    },
    description: String
  }
}, { _id: true });

// 📍 Delivery Address Schema (embedded from User types)
const deliveryAddressSchema = new Schema({
  title: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  neighborhood: String,
  street: { type: String, required: true },
  buildingNo: { type: String, required: true },
  apartmentNo: String,
  floor: String,
  doorNo: String,
  directions: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  }
}, { _id: false });

// 🛒 Main Order Schema
const orderSchema = new Schema<IOrderDocument>({
  orderNumber: {
    type: String,
    required: [true, 'Sipariş numarası gereklidir'],
    unique: true,
    index: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Müşteri ID gereklidir'],
    index: true
  },
  
  // 📦 Order Items
  items: {
    type: [orderItemSchema],
    required: [true, 'Sipariş kalemi gereklidir'],
    validate: {
      validator: function(v: IOrderItem[]) {
        return v && v.length > 0;
      },
      message: 'En az bir sipariş kalemi olmalıdır'
    }
  },
  
  // 💰 Pricing
  subtotal: {
    type: Number,
    required: [true, 'Ara toplam gereklidir'],
    min: [0, 'Ara toplam negatif olamaz']
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Vergi tutarı negatif olamaz']
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: [0, 'Teslimat ücreti negatif olamaz']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'İndirim tutarı negatif olamaz']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Toplam tutar gereklidir'],
    min: [0, 'Toplam tutar negatif olamaz'],
    index: true
  },
  currency: {
    type: String,
    enum: {
      values: ['TRY', 'USD', 'EUR'],
      message: 'Geçersiz para birimi'
    },
    default: 'TRY'
  },
  
  // 🏷️ Discounts & Loyalty
  appliedCoupons: [appliedCouponSchema],
  loyaltyPointsUsed: {
    type: Number,
    default: 0,
    min: [0, 'Kullanılan puan negatif olamaz']
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0,
    min: [0, 'Kazanılan puan negatif olamaz']
  },
  
  // 📍 Delivery Information
  deliveryAddress: {
    type: deliveryAddressSchema,
    required: [true, 'Teslimat adresi gereklidir']
  },
  deliveryType: {
    type: String,
    required: [true, 'Teslimat tipi gereklidir'],
    enum: {
      values: ['delivery', 'pickup', 'dine-in'],
      message: 'Geçersiz teslimat tipi'
    },
    index: true
  },
  estimatedDeliveryTime: {
    type: Date,
    required: [true, 'Tahmini teslimat zamanı gereklidir']
  },
  actualDeliveryTime: Date,
  deliveryNotes: {
    type: String,
    maxlength: [500, 'Teslimat notu en fazla 500 karakter olabilir']
  },
  
  // 📞 Contact Information
  contactPhone: {
    type: String,
    required: [true, 'İletişim telefonu gereklidir'],
    validate: {
      validator: function(v: string) {
        return /^(\+90|0)?[5][0-9]{9}$/.test(v);
      },
      message: 'Geçerli bir telefon numarası giriniz'
    }
  },
  alternativePhone: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^(\+90|0)?[5][0-9]{9}$/.test(v);
      },
      message: 'Geçerli bir telefon numarası giriniz'
    }
  },
  
  // 💳 Payment Information
  paymentMethod: {
    type: String,
    required: [true, 'Ödeme yöntemi gereklidir'],
    enum: {
      values: ['cash', 'card', 'online', 'wallet'],
      message: 'Geçersiz ödeme yöntemi'
    },
    index: true
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded', 'partial'],
      message: 'Geçersiz ödeme durumu'
    },
    default: 'pending',
    index: true
  },
  paymentDetails: paymentDetailsSchema,
  
  // 📊 Order Status & Tracking
  status: {
    type: String,
    required: [true, 'Sipariş durumu gereklidir'],
    enum: {
      values: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'completed', 'cancelled', 'refunded'],
      message: 'Geçersiz sipariş durumu'
    },
    default: 'pending',
    index: true
  },
  statusHistory: [orderStatusHistorySchema],
  
  // 👨‍💼 Staff Assignment
  assignedTo: {
    kitchen: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    delivery: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    cashier: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // ⏰ Timing
  orderDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  confirmedAt: Date,
  preparedAt: Date,
  readyAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
  completedAt: Date,
  
  // 📝 Additional Information
  specialInstructions: {
    type: String,
    maxlength: [1000, 'Özel talimat en fazla 1000 karakter olabilir']
  },
  customerNotes: {
    type: String,
    maxlength: [500, 'Müşteri notu en fazla 500 karakter olabilir']
  },
  internalNotes: {
    type: String,
    maxlength: [1000, 'Dahili not en fazla 1000 karakter olabilir']
  },
  
  // 🔄 Order Management
  isPreOrder: {
    type: Boolean,
    default: false
  },
  scheduledFor: Date,
  repeatOrder: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    nextOrderDate: Date
  },
  
  // 📊 Analytics & Feedback
  rating: {
    overall: {
      type: Number,
      min: [1, 'Rating en az 1 olmalıdır'],
      max: [5, 'Rating en fazla 5 olabilir']
    },
    food: {
      type: Number,
      min: [1, 'Yemek rating en az 1 olmalıdır'],
      max: [5, 'Yemek rating en fazla 5 olabilir']
    },
    delivery: {
      type: Number,
      min: [1, 'Teslimat rating en az 1 olmalıdır'],
      max: [5, 'Teslimat rating en fazla 5 olabilir']
    },
    service: {
      type: Number,
      min: [1, 'Servis rating en az 1 olmalıdır'],
      max: [5, 'Servis rating en fazla 5 olabilir']
    },
    comment: {
      type: String,
      maxlength: [1000, 'Yorum en fazla 1000 karakter olabilir']
    },
    ratedAt: Date
  },
  
  // 🚨 Issues & Support
  issues: [orderIssueSchema],
  
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'orders'
});

// 📇 Indexes for better performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerId: 1, orderDate: -1 });
orderSchema.index({ status: 1, orderDate: -1 });
orderSchema.index({ deliveryType: 1, status: 1 });
orderSchema.index({ paymentMethod: 1, paymentStatus: 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ totalAmount: -1 });

// 🔧 Pre-save middleware
orderSchema.pre('save', function(next) {
  // Auto-generate order number if not provided
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    this.orderNumber = `LD-${year}${month}${day}-${random}`;
  }
  
  // Add initial status to history
  if (this.isNew && this.status) {
    this.statusHistory.push({
      status: this.status as IOrderStatus,
      timestamp: new Date(),
      reason: 'Sipariş oluşturuldu'
    });
  }
  
  next();
});

// 🔧 Instance Methods
orderSchema.methods.calculateTotals = async function(): Promise<void> {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((total: number, item: IOrderItem) => {
    return total + item.totalPrice;
  }, 0);
  
  // Calculate tax (18% KDV in Turkey)
  this.taxAmount = Math.round(this.subtotal * 0.18);
  
  // Calculate final total
  this.totalAmount = this.subtotal + this.taxAmount + this.deliveryFee - this.discountAmount;
  
  await this.save();
};

orderSchema.methods.updateStatus = async function(
  newStatus: IOrderStatus, 
  updatedBy?: mongoose.Types.ObjectId, 
  reason?: string
): Promise<void> {
  this.status = newStatus;
  
  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy,
    reason
  });
  
  // Update timing fields
  const now = new Date();
  switch (newStatus) {
    case 'confirmed':
      this.confirmedAt = now;
      break;
    case 'ready':
      this.readyAt = now;
      break;
    case 'out-for-delivery':
      this.pickedUpAt = now;
      break;
    case 'delivered':
      this.deliveredAt = now;
      break;
    case 'completed':
      this.completedAt = now;
      break;
  }
  
  await this.save();
};

orderSchema.methods.canBeCancelled = function(): boolean {
  const cancellableStatuses: IOrderStatus[] = ['pending', 'confirmed'];
  return cancellableStatuses.includes(this.status);
};

orderSchema.methods.canBeRefunded = function(): boolean {
  const refundableStatuses: IOrderStatus[] = ['delivered', 'completed'];
  return refundableStatuses.includes(this.status) && this.paymentStatus === 'paid';
};

orderSchema.methods.getEstimatedDeliveryTime = function(): Date {
  if (this.estimatedDeliveryTime) return this.estimatedDeliveryTime;
  
  // Calculate based on preparation time + delivery time
  const totalPrepTime = this.items.reduce((total: number, item: IOrderItem) => {
    return Math.max(total, item.estimatedPrepTime);
  }, 0);
  
  const deliveryTime = this.deliveryType === 'delivery' ? 30 : 0; // 30 min delivery
  const estimatedTime = new Date(Date.now() + (totalPrepTime + deliveryTime) * 60000);
  
  return estimatedTime;
};

// 🔍 Static Query Methods
orderSchema.statics.findByCustomer = function(customerId: mongoose.Types.ObjectId) {
  return this.find({ customerId, isActive: true })
    .sort({ orderDate: -1 })
    .populate('customerId', 'firstName lastName email phone')
    .populate('items.productId', 'name thumbnail');
};

orderSchema.statics.findByStatus = function(status: IOrderStatus) {
  return this.find({ status, isActive: true })
    .sort({ orderDate: -1 })
    .populate('customerId', 'firstName lastName phone');
};

orderSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    orderDate: {
      $gte: startDate,
      $lte: endDate
    },
    isActive: true
  }).sort({ orderDate: -1 });
};

orderSchema.statics.findPending = function() {
  return this.find({ 
    status: { $in: ['pending', 'confirmed', 'preparing'] },
    isActive: true 
  }).sort({ orderDate: 1 });
};

orderSchema.statics.findActiveOrders = function() {
  return this.find({
    status: { $nin: ['delivered', 'completed', 'cancelled', 'refunded'] },
    isActive: true
  }).sort({ orderDate: 1 });
};

orderSchema.statics.searchByOrderNumber = function(orderNumber: string) {
  return this.findOne({ orderNumber, isActive: true })
    .populate('customerId', 'firstName lastName email phone')
    .populate('items.productId', 'name thumbnail price');
};

// 🌟 Create and export the model
interface IOrderModel extends Model<IOrderDocument>, IOrderQuery {}

export const Order = mongoose.model<IOrderDocument, IOrderModel>('Order', orderSchema);

// 🚀 Helper function for creating orders
export const createOrder = async (orderData: IOrderCreateInput): Promise<IOrderDocument> => {
  try {
    const order = new Order(orderData);
    await order.calculateTotals(); // Calculate totals before saving
    return order;
  } catch (error: any) {
    throw error;
  }
};
