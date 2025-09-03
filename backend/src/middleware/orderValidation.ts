import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

// 📝 Order Creation Validation
export const validateOrderCreation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = [];
  const { 
    customerId, 
    items, 
    deliveryAddress, 
    deliveryType, 
    contactPhone, 
    paymentMethod 
  } = req.body;

  // Customer ID validation
  if (!customerId) {
    errors.push('Müşteri ID gereklidir');
  } else if (!isValidObjectId(customerId)) {
    errors.push('Geçersiz müşteri ID formatı');
  }

  // Items validation
  if (!items || !Array.isArray(items)) {
    errors.push('Sipariş kalemleri gereklidir ve array olmalıdır');
  } else if (items.length === 0) {
    errors.push('En az bir ürün seçilmelidir');
  } else {
    items.forEach((item: any, index: number) => {
      if (!item.productId) {
        errors.push(`Ürün ${index + 1} için productId gereklidir`);
      } else if (!isValidObjectId(item.productId)) {
        errors.push(`Ürün ${index + 1} için geçersiz productId formatı`);
      }

      if (!item.quantity || typeof item.quantity !== 'number') {
        errors.push(`Ürün ${index + 1} için quantity gereklidir ve sayı olmalıdır`);
      } else if (item.quantity < 1 || item.quantity > 50) {
        errors.push(`Ürün ${index + 1} için quantity 1-50 arasında olmalıdır`);
      }

      // Special instructions length check
      if (item.specialInstructions && item.specialInstructions.length > 500) {
        errors.push(`Ürün ${index + 1} için özel talimat en fazla 500 karakter olabilir`);
      }

      // Validate selected customizations
      if (item.selectedCustomizations && Array.isArray(item.selectedCustomizations)) {
        item.selectedCustomizations.forEach((custom: any, customIndex: number) => {
          if (!custom.customizationId || !isValidObjectId(custom.customizationId)) {
            errors.push(`Ürün ${index + 1}, özelleştirme ${customIndex + 1} için geçersiz ID`);
          }
          
          if (!custom.selectedOptions || !Array.isArray(custom.selectedOptions)) {
            errors.push(`Ürün ${index + 1}, özelleştirme ${customIndex + 1} için seçenekler gereklidir`);
          }
        });
      }
    });
  }

  // Delivery address validation
  if (!deliveryAddress || typeof deliveryAddress !== 'object') {
    errors.push('Teslimat adresi gereklidir');
  } else {
    const addressErrors = validateDeliveryAddress(deliveryAddress);
    errors.push(...addressErrors);
  }

  // Delivery type validation
  const validDeliveryTypes = ['delivery', 'pickup', 'dine-in'];
  if (!deliveryType) {
    errors.push('Teslimat tipi gereklidir');
  } else if (!validDeliveryTypes.includes(deliveryType)) {
    errors.push(`Geçersiz teslimat tipi. Geçerli değerler: ${validDeliveryTypes.join(', ')}`);
  }

  // Contact phone validation
  if (!contactPhone) {
    errors.push('İletişim telefonu gereklidir');
  } else if (!isValidTurkishPhone(contactPhone)) {
    errors.push('Geçerli bir Türkiye telefon numarası giriniz');
  }

  // Payment method validation
  const validPaymentMethods = ['cash', 'card', 'online', 'wallet'];
  if (!paymentMethod) {
    errors.push('Ödeme yöntemi gereklidir');
  } else if (!validPaymentMethods.includes(paymentMethod)) {
    errors.push(`Geçersiz ödeme yöntemi. Geçerli değerler: ${validPaymentMethods.join(', ')}`);
  }

  // Optional fields validation
  if (req.body.specialInstructions && req.body.specialInstructions.length > 1000) {
    errors.push('Özel talimat en fazla 1000 karakter olabilir');
  }

  if (req.body.customerNotes && req.body.customerNotes.length > 500) {
    errors.push('Müşteri notu en fazla 500 karakter olabilir');
  }

  if (req.body.scheduledFor) {
    const scheduledDate = new Date(req.body.scheduledFor);
    const now = new Date();
    
    if (isNaN(scheduledDate.getTime())) {
      errors.push('Geçersiz zamanlama tarihi formatı');
    } else if (scheduledDate < now) {
      errors.push('Zamanlama tarihi gelecekte olmalıdır');
    } else if (scheduledDate > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      errors.push('Zamanlama tarihi en fazla 7 gün sonrası olabilir');
    }
  }

  if (req.body.loyaltyPointsToUse) {
    const points = parseInt(req.body.loyaltyPointsToUse);
    if (isNaN(points) || points < 0) {
      errors.push('Sadakat puanı 0 veya daha büyük olmalıdır');
    } else if (points > 10000) {
      errors.push('Tek seferde en fazla 10,000 puan kullanılabilir');
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, `Sipariş validation hatası: ${errors.join(', ')}`);
  }

  next();
};

// 📍 Delivery Address Validation
const validateDeliveryAddress = (address: any): string[] => {
  const errors: string[] = [];

  const requiredFields = ['title', 'fullName', 'phone', 'city', 'district', 'street', 'buildingNo'];
  requiredFields.forEach(field => {
    if (!address[field] || typeof address[field] !== 'string' || address[field].trim().length === 0) {
      const fieldNames: { [key: string]: string } = {
        title: 'Adres başlığı',
        fullName: 'Ad soyad',
        phone: 'Telefon',
        city: 'Şehir',
        district: 'İlçe',
        street: 'Sokak',
        buildingNo: 'Bina numarası'
      };
      errors.push(`${fieldNames[field]} gereklidir`);
    }
  });

  // Phone validation
  if (address.phone && !isValidTurkishPhone(address.phone)) {
    errors.push('Geçerli bir telefon numarası giriniz');
  }

  // Field length validations
  if (address.title && address.title.length > 50) {
    errors.push('Adres başlığı en fazla 50 karakter olabilir');
  }

  if (address.fullName && address.fullName.length > 100) {
    errors.push('Ad soyad en fazla 100 karakter olabilir');
  }

  if (address.directions && address.directions.length > 500) {
    errors.push('Adres tarifi en fazla 500 karakter olabilir');
  }

  // Coordinates validation
  if (address.coordinates) {
    if (typeof address.coordinates !== 'object') {
      errors.push('Koordinatlar object olmalıdır');
    } else {
      const { latitude, longitude } = address.coordinates;
      
      if (latitude !== undefined) {
        const lat = parseFloat(latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
          errors.push('Geçersiz enlem değeri (-90 ile 90 arasında olmalıdır)');
        }
      }
      
      if (longitude !== undefined) {
        const lng = parseFloat(longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) {
          errors.push('Geçersiz boylam değeri (-180 ile 180 arasında olmalıdır)');
        }
      }
    }
  }

  return errors;
};

// 📊 Order Status Update Validation
export const validateStatusUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = [];
  const { status, reason, notes } = req.body;

  // Status validation
  const validStatuses = [
    'pending', 'confirmed', 'preparing', 'ready',
    'out-for-delivery', 'delivered', 'completed', 'cancelled', 'refunded'
  ];

  if (!status) {
    errors.push('Durum gereklidir');
  } else if (!validStatuses.includes(status)) {
    errors.push(`Geçersiz durum. Geçerli değerler: ${validStatuses.join(', ')}`);
  }

  // Reason validation for certain statuses
  const statusesRequiringReason = ['cancelled', 'refunded'];
  if (statusesRequiringReason.includes(status) && (!reason || reason.trim().length === 0)) {
    errors.push(`${status} durumu için sebep belirtilmelidir`);
  }

  // Length validations
  if (reason && reason.length > 500) {
    errors.push('Sebep en fazla 500 karakter olabilir');
  }

  if (notes && notes.length > 1000) {
    errors.push('Notlar en fazla 1000 karakter olabilir');
  }

  if (errors.length > 0) {
    throw new ApiError(400, `Durum güncelleme validation hatası: ${errors.join(', ')}`);
  }

  next();
};

// 💳 Payment Status Update Validation
export const validatePaymentUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = [];
  const { paymentStatus, paymentDetails } = req.body;

  // Payment status validation
  const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'partial'];
  if (!paymentStatus) {
    errors.push('Ödeme durumu gereklidir');
  } else if (!validPaymentStatuses.includes(paymentStatus)) {
    errors.push(`Geçersiz ödeme durumu. Geçerli değerler: ${validPaymentStatuses.join(', ')}`);
  }

  // Payment details validation
  if (paymentDetails && typeof paymentDetails === 'object') {
    // Transaction ID validation
    if (paymentDetails.transactionId && typeof paymentDetails.transactionId !== 'string') {
      errors.push('Transaction ID string olmalıdır');
    }

    // Payment gateway validation
    if (paymentDetails.paymentGateway) {
      const validGateways = ['stripe', 'iyzico', 'paytr'];
      if (!validGateways.includes(paymentDetails.paymentGateway)) {
        errors.push(`Geçersiz ödeme gateway. Geçerli değerler: ${validGateways.join(', ')}`);
      }
    }

    // Card details validation
    if (paymentDetails.cardLastFour) {
      if (!/^\d{4}$/.test(paymentDetails.cardLastFour)) {
        errors.push('Kart son 4 hanesi 4 rakam olmalıdır');
      }
    }

    // Amount validation
    if (paymentDetails.refundAmount !== undefined) {
      const amount = parseFloat(paymentDetails.refundAmount);
      if (isNaN(amount) || amount < 0) {
        errors.push('İade tutarı 0 veya daha büyük olmalıdır');
      } else if (amount > 50000) {
        errors.push('İade tutarı 50,000 TL\'den fazla olamaz');
      }
    }

    // Refund reason validation
    if (paymentStatus === 'refunded' && (!paymentDetails.refundReason || paymentDetails.refundReason.trim().length === 0)) {
      errors.push('İade işlemi için sebep belirtilmelidir');
    }

    if (paymentDetails.refundReason && paymentDetails.refundReason.length > 500) {
      errors.push('İade sebebi en fazla 500 karakter olabilir');
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, `Ödeme güncelleme validation hatası: ${errors.join(', ')}`);
  }

  next();
};

// 🔍 Order Search Query Validation
export const validateOrderSearchQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = [];

  // At least one search parameter should be provided
  const searchParams = ['orderNumber', 'customerName', 'customerPhone', 'customerEmail'];
  const hasSearchParam = searchParams.some(param => req.query[param]);

  if (!hasSearchParam) {
    errors.push(`En az bir arama parametresi gereklidir: ${searchParams.join(', ')}`);
  }

  // Validate individual search parameters
  if (req.query.orderNumber && typeof req.query.orderNumber === 'string') {
    if (req.query.orderNumber.length < 3) {
      errors.push('Sipariş numarası en az 3 karakter olmalıdır');
    } else if (req.query.orderNumber.length > 50) {
      errors.push('Sipariş numarası en fazla 50 karakter olabilir');
    }
  }

  if (req.query.customerName && typeof req.query.customerName === 'string') {
    if (req.query.customerName.length < 2) {
      errors.push('Müşteri adı en az 2 karakter olmalıdır');
    } else if (req.query.customerName.length > 100) {
      errors.push('Müşteri adı en fazla 100 karakter olabilir');
    }
  }

  if (req.query.customerPhone && typeof req.query.customerPhone === 'string') {
    if (req.query.customerPhone.length < 10) {
      errors.push('Telefon numarası en az 10 karakter olmalıdır');
    }
  }

  if (req.query.customerEmail && typeof req.query.customerEmail === 'string') {
    if (!isValidEmail(req.query.customerEmail)) {
      errors.push('Geçerli bir e-posta adresi giriniz');
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, `Arama validation hatası: ${errors.join(', ')}`);
  }

  next();
};

// 🔧 Helper Functions
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const isValidTurkishPhone = (phone: string): boolean => {
  return /^(\+90|0)?[5][0-9]{9}$/.test(phone);
};

const isValidEmail = (email: string): boolean => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

// 🚫 Order Cancellation Business Logic Validation
export const validateOrderCancellation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = [];
  const { reason } = req.body;

  // Reason is required for cancellation
  if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
    errors.push('İptal sebebi gereklidir');
  } else if (reason.length > 500) {
    errors.push('İptal sebebi en fazla 500 karakter olabilir');
  }

  // Optional cancellation fee validation
  if (req.body.cancellationFee !== undefined) {
    const fee = parseFloat(req.body.cancellationFee);
    if (isNaN(fee) || fee < 0) {
      errors.push('İptal ücreti 0 veya daha büyük olmalıdır');
    } else if (fee > 1000) {
      errors.push('İptal ücreti 1,000 TL\'den fazla olamaz');
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, `İptal validation hatası: ${errors.join(', ')}`);
  }

  next();
};
