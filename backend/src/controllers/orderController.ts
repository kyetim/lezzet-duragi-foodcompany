import { Request, Response, NextFunction } from 'express';
import { Order, createOrder } from '../models/Order.model';
import { Product } from '../models/Product.model';
import {
  IOrderCreateInput,
  IOrderStatus,
  IOrderSearchFilters
} from '../types/order.types';

// 🎯 Standard API Response Interface
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// 📝 Helper function for consistent API responses
const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  pagination?: any
): void => {
  const response: ApiResponse<T> = {
    success,
    message,
    ...(data && { data }),
    ...(pagination && { pagination })
  };

  res.status(statusCode).json(response);
};

// 📄 GET /api/orders - Siparişleri listele (Admin + Customer)
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('📄 GET /api/orders - Siparişler isteniyor');

    // Query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    // Filters
    const filters: any = { isActive: true };

    // Customer filter (eğer customer ise sadece kendi siparişlerini görsün)
    if (req.query.customerId) {
      filters.customerId = req.query.customerId;
    }

    if (req.query.status) {
      const statuses = Array.isArray(req.query.status)
        ? req.query.status
        : [req.query.status];
      filters.status = { $in: statuses };
    }

    if (req.query.paymentMethod) {
      filters.paymentMethod = req.query.paymentMethod;
    }

    if (req.query.deliveryType) {
      filters.deliveryType = req.query.deliveryType;
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filters.orderDate = {};
      if (req.query.startDate) {
        filters.orderDate.$gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        filters.orderDate.$lte = new Date(req.query.endDate as string);
      }
    }

    // Amount range filter
    if (req.query.minAmount || req.query.maxAmount) {
      filters.totalAmount = {};
      if (req.query.minAmount) {
        filters.totalAmount.$gte = parseFloat(req.query.minAmount as string);
      }
      if (req.query.maxAmount) {
        filters.totalAmount.$lte = parseFloat(req.query.maxAmount as string);
      }
    }

    // Sorting
    const sortField = req.query.sortBy as string || 'orderDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrder };

    console.log('🔍 Order filters:', filters);
    console.log('📊 Pagination:', { page, limit, skip });

    // Execute queries
    const [orders, totalCount] = await Promise.all([
      Order.find(filters)
        // @ts-ignore
        .populate('customerId', 'firstName lastName email phone')
        // @ts-ignore
        .populate('items.productId', 'name thumbnail price')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filters)
    ]);

    // Pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };

    console.log(`✅ ${orders.length} sipariş bulundu`);

    sendResponse(res, 200, true, 'Siparişler başarıyla getirildi', orders, pagination);

  } catch (error: any) {
    console.error('❌ Siparişler getirilirken hata:', error);
    next(error);
  }
};

// 🔍 GET /api/orders/:id - Tek sipariş detayı
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/orders/${id} - Sipariş detayı isteniyor`);

    const order = await Order.findOne({ _id: id, isActive: true })
      // @ts-ignore
      .populate('customerId', 'firstName lastName email phone addresses')
      // @ts-ignore
      .populate('items.productId', 'name thumbnail price description')
      // @ts-ignore
      .populate('assignedTo.kitchen', 'firstName lastName')
      // @ts-ignore
      .populate('assignedTo.delivery', 'firstName lastName phone')
      // @ts-ignore
      .populate('assignedTo.cashier', 'firstName lastName');

    if (!order) {
      sendResponse(res, 404, false, 'Sipariş bulunamadı');
      return;
    }

    console.log(`✅ Sipariş bulundu: ${order.orderNumber}`);
    sendResponse(res, 200, true, 'Sipariş başarıyla getirildi', order);

  } catch (error: any) {
    console.error('❌ Sipariş getirilirken hata:', error);
    next(error);
  }
};

// ➕ POST /api/orders - Yeni sipariş oluştur
export const createNewOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('➕ POST /api/orders - Yeni sipariş oluşturuluyor');
    console.log('📝 Request body:', req.body);

    // Request validation
    const requiredFields = ['customerId', 'items', 'deliveryAddress', 'deliveryType', 'contactPhone', 'paymentMethod'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      sendResponse(
        res,
        400,
        false,
        `Zorunlu alanlar eksik: ${missingFields.join(', ')}`
      );
      return;
    }

    // Validate items
    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      sendResponse(res, 400, false, 'En az bir ürün seçilmelidir');
      return;
    }

    // Validate and enrich items with product data
    const enrichedItems: any[] = []; // Temporary any[] type for stability  
    let totalEstimatedPrepTime = 0;

    for (const item of req.body.items) {
      if (!item.productId || !item.quantity) {
        sendResponse(res, 400, false, 'Her ürün için productId ve quantity gereklidir');
        return;
      }

      // Get product details
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive || !product.isAvailable) {
        sendResponse(res, 400, false, `Ürün bulunamadı veya mevcut değil: ${item.productId}`);
        return;
      }

      // Check availability and stock
      if (product.isStockTracked && product.stockQuantity !== undefined) {
        if (product.stockQuantity < item.quantity) {
          sendResponse(res, 400, false, `${product.name} için yeterli stok yok. Mevcut: ${product.stockQuantity}`);
          return;
        }
      }

      // Calculate pricing
      let unitPrice = product.price;

      // Apply portion pricing
      if (item.selectedPortion) {
        const portion = product.portions.find(p => p.name === item.selectedPortion.name);
        if (portion) {
          unitPrice += portion.priceModifier;
        }
      }

      // Apply customization pricing
      let customizationTotal = 0;
      if (item.selectedCustomizations) {
        for (const customization of item.selectedCustomizations) {
          customizationTotal += customization.totalPriceModifier || 0;
        }
      }
      unitPrice += customizationTotal;

      const enrichedItem = {
        productId: product._id,
        productName: product.name,
        productImage: product.thumbnail,
        quantity: item.quantity,
        unitPrice: unitPrice,
        originalUnitPrice: product.price,
        totalPrice: unitPrice * item.quantity,
        selectedPortion: item.selectedPortion,
        selectedCustomizations: item.selectedCustomizations || [],
        specialInstructions: item.specialInstructions
        // Note: status and estimatedPrepTime are added by the Order model pre-save hooks
      };

      enrichedItems.push(enrichedItem);
      totalEstimatedPrepTime = Math.max(totalEstimatedPrepTime, product.preparationTime);
    }

    // Calculate estimated delivery time
    const deliveryTime = req.body.deliveryType === 'delivery' ? 30 : 0; // 30 min for delivery
    const estimatedDeliveryTime = new Date(Date.now() + (totalEstimatedPrepTime + deliveryTime) * 60000);

    // Create order data
    const orderData: IOrderCreateInput = {
      customerId: req.body.customerId,
      items: enrichedItems,
      deliveryAddress: req.body.deliveryAddress,
      deliveryType: req.body.deliveryType,
      contactPhone: req.body.contactPhone,
      paymentMethod: req.body.paymentMethod,
      specialInstructions: req.body.specialInstructions,
      customerNotes: req.body.customerNotes,
      scheduledFor: req.body.scheduledFor,
      appliedCoupons: req.body.appliedCoupons || [],
      loyaltyPointsToUse: req.body.loyaltyPointsToUse || 0
    };

    // Add estimated delivery time
    (orderData as any).estimatedDeliveryTime = estimatedDeliveryTime;

    const newOrder = await createOrder(orderData);

    // Update product order counts and stock
    for (const item of enrichedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          orderCount: item.quantity,
          ...(req.body.items.find((reqItem: any) => reqItem.productId === item.productId.toString())?.updateStock && {
            stockQuantity: -item.quantity
          })
        }
      });
    }

    console.log(`✅ Yeni sipariş oluşturuldu: ${newOrder.orderNumber} (ID: ${newOrder._id})`);

    // Return order with populated data
    const populatedOrder = await Order.findById(newOrder._id)
      // @ts-ignore
      .populate('customerId', 'firstName lastName email phone')
      // @ts-ignore
      .populate('items.productId', 'name thumbnail price');

    sendResponse(res, 201, true, 'Sipariş başarıyla oluşturuldu', populatedOrder);

  } catch (error: any) {
    console.error('❌ Sipariş oluşturulurken hata:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      sendResponse(res, 400, false, 'Validation hatası', validationErrors);
      return;
    }

    next(error);
  }
};

// ✏️ PUT /api/orders/:id/status - Sipariş durumu güncelle (Admin)
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reason, notes } = req.body;

    console.log(`✏️ PUT /api/orders/${id}/status - Durum güncelleniyor: ${status}`);

    // Validate status
    const validStatuses: IOrderStatus[] = [
      'pending', 'confirmed', 'preparing', 'ready',
      'out-for-delivery', 'delivered', 'completed', 'cancelled', 'refunded'
    ];

    if (!validStatuses.includes(status)) {
      sendResponse(res, 400, false, `Geçersiz durum: ${status}`);
      return;
    }

    const order = await Order.findOne({ _id: id, isActive: true });

    if (!order) {
      sendResponse(res, 404, false, 'Sipariş bulunamadı');
      return;
    }

    // Business logic for status transitions
    const currentStatus = order.status;

    // Prevent invalid status transitions
    if (currentStatus === 'completed' || currentStatus === 'cancelled' || currentStatus === 'refunded') {
      sendResponse(res, 400, false, `${currentStatus} durumundaki sipariş güncellenemez`);
      return;
    }

    // Update status
    await order.updateStatus(
      status,
      req.body.updatedBy, // Would come from auth middleware
      reason
    );

    // Add notes if provided
    if (notes) {
      order.internalNotes = (order.internalNotes || '') + `\n[${new Date().toISOString()}] ${notes}`;
      await order.save();
    }

    console.log(`✅ Sipariş durumu güncellendi: ${order.orderNumber} → ${status}`);

    // Return updated order
    const updatedOrder = await Order.findById(order._id)
      // @ts-ignore
      .populate('customerId', 'firstName lastName email phone');

    sendResponse(res, 200, true, 'Sipariş durumu başarıyla güncellendi', updatedOrder);

  } catch (error: any) {
    console.error('❌ Sipariş durumu güncellenirken hata:', error);
    next(error);
  }
};

// 💳 PUT /api/orders/:id/payment - Ödeme durumu güncelle
export const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentDetails } = req.body;

    console.log(`💳 PUT /api/orders/${id}/payment - Ödeme durumu güncelleniyor: ${paymentStatus}`);

    const order = await Order.findOne({ _id: id, isActive: true });

    if (!order) {
      sendResponse(res, 404, false, 'Sipariş bulunamadı');
      return;
    }

    // Update payment status
    order.paymentStatus = paymentStatus;

    if (paymentDetails) {
      order.paymentDetails = {
        ...order.paymentDetails,
        ...paymentDetails
      };
    }

    // If payment is successful, update status to confirmed
    if (paymentStatus === 'paid' && order.status === 'pending') {
      await order.updateStatus('confirmed', undefined, 'Ödeme alındı');
    }

    await order.save();

    console.log(`✅ Ödeme durumu güncellendi: ${order.orderNumber} → ${paymentStatus}`);

    sendResponse(res, 200, true, 'Ödeme durumu başarıyla güncellendi', order);

  } catch (error: any) {
    console.error('❌ Ödeme durumu güncellenirken hata:', error);
    next(error);
  }
};

// 🗑️ DELETE /api/orders/:id - Sipariş iptal et
export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    console.log(`🗑️ DELETE /api/orders/${id} - Sipariş iptal ediliyor`);

    const order = await Order.findOne({ _id: id, isActive: true });

    if (!order) {
      sendResponse(res, 404, false, 'Sipariş bulunamadı');
      return;
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      sendResponse(res, 400, false, 'Bu sipariş artık iptal edilemez');
      return;
    }

    // Cancel order
    await order.updateStatus('cancelled', req.body.cancelledBy, reason || 'Sipariş iptal edildi');

    // Restore stock if tracked
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product && product.isStockTracked) {
        product.stockQuantity = (product.stockQuantity || 0) + item.quantity;
        await product.save();
      }
    }

    console.log(`✅ Sipariş iptal edildi: ${order.orderNumber}`);

    sendResponse(res, 200, true, 'Sipariş başarıyla iptal edildi', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status
    });

  } catch (error: any) {
    console.error('❌ Sipariş iptal edilirken hata:', error);
    next(error);
  }
};

// 🔍 GET /api/orders/search - Sipariş arama
export const searchOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('🔍 GET /api/orders/search - Sipariş arama');

    const {
      orderNumber,
      customerName,
      customerPhone,
      customerEmail
    } = req.query;

    const filters: any = { isActive: true };

    // Order number search
    if (orderNumber) {
      filters.orderNumber = { $regex: orderNumber, $options: 'i' };
    }

    // Customer search
    let customerFilters: any = {};
    if (customerName) {
      customerFilters.$or = [
        { firstName: { $regex: customerName, $options: 'i' } },
        { lastName: { $regex: customerName, $options: 'i' } }
      ];
    }
    if (customerPhone) {
      customerFilters.phone = { $regex: customerPhone, $options: 'i' };
    }
    if (customerEmail) {
      customerFilters.email = { $regex: customerEmail, $options: 'i' };
    }

    console.log('🔍 Search filters:', filters);
    console.log('👤 Customer filters:', customerFilters);

    let query = Order.find(filters)
      // @ts-ignore
      .populate('customerId', 'firstName lastName email phone')
      // @ts-ignore
      // @ts-ignore
      .populate('items.productId', 'name thumbnail')
      .sort({ orderDate: -1 })
      .limit(50);

    // If customer filters exist, add them
    if (Object.keys(customerFilters).length > 0) {
      // @ts-ignore
      query = query.populate({
        path: 'customerId',
        select: 'firstName lastName email phone',
        match: customerFilters
      });
    }

    const orders = await query.exec();

    // Filter out orders where customer match failed
    const filteredOrders = orders.filter(order => order.customerId);

    console.log(`✅ ${filteredOrders.length} sipariş bulundu`);

    sendResponse(res, 200, true, 'Arama tamamlandı', filteredOrders);

  } catch (error: any) {
    console.error('❌ Sipariş arama hatası:', error);
    next(error);
  }
};

// 🏆 GET /api/orders/active - Aktif siparişler (Dashboard için)
export const getActiveOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('🏆 GET /api/orders/active - Aktif siparişler');

    const activeOrders = await Order.findActiveOrders()
      // @ts-ignore
      // @ts-ignore
      .populate('customerId', 'firstName lastName phone')
      // @ts-ignore
      .populate('items.productId', 'name preparationTime')
      .sort({ orderDate: 1 }); // Oldest first for kitchen

    // Group by status for better organization
    const groupedOrders = {
      pending: activeOrders.filter(order => order.status === 'pending'),
      confirmed: activeOrders.filter(order => order.status === 'confirmed'),
      preparing: activeOrders.filter(order => order.status === 'preparing'),
      ready: activeOrders.filter(order => order.status === 'ready'),
      outForDelivery: activeOrders.filter(order => order.status === 'out-for-delivery')
    };

    console.log(`✅ ${activeOrders.length} aktif sipariş bulundu`);

    sendResponse(res, 200, true, 'Aktif siparişler getirildi', {
      total: activeOrders.length,
      grouped: groupedOrders,
      list: activeOrders
    });

  } catch (error: any) {
    console.error('❌ Aktif siparişler getirilirken hata:', error);
    next(error);
  }
};

// 📊 GET /api/orders/analytics - Sipariş analytics
export const getOrderAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('📊 GET /api/orders/analytics - Sipariş analytics');

    const { period = 'week' } = req.query;

    // Date range based on period
    let startDate: Date;
    const endDate = new Date();

    switch (period) {
      case 'day':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    const filters = {
      orderDate: { $gte: startDate, $lte: endDate },
      isActive: true
    };

    // Aggregate analytics
    const [
      totalStats,
      statusDistribution,
      revenueByDay,
      popularItems
    ] = await Promise.all([
      // Total statistics
      Order.aggregate([
        { $match: filters },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            completedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            }
          }
        }
      ]),

      // Status distribution
      Order.aggregate([
        { $match: filters },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      // Revenue by day
      Order.aggregate([
        { $match: filters },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
            revenue: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Popular items
      Order.aggregate([
        { $match: filters },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            productName: { $first: '$items.productName' },
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: '$items.totalPrice' }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 }
      ])
    ]);

    const analytics = {
      period,
      dateRange: { startDate, endDate },
      summary: totalStats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        completedOrders: 0
      },
      statusDistribution: statusDistribution.reduce((acc: any, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      revenueByDay,
      popularItems,
      performance: {
        completionRate: totalStats[0]
          ? ((totalStats[0].completedOrders / totalStats[0].totalOrders) * 100).toFixed(2)
          : '0.00'
      }
    };

    console.log(`✅ Analytics hesaplandı (${period})`);

    sendResponse(res, 200, true, 'Analytics getirildi', analytics);

  } catch (error: any) {
    console.error('❌ Analytics getirilirken hata:', error);
    next(error);
  }
};
