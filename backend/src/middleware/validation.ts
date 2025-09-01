import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

// 🎯 Validation Result Interface
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// 📝 Product Creation Validation
export const validateProductCreation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = [];
  const { name, description, categoryId, price, preparationTime } = req.body;

  // Required fields validation
  if (!name || name.trim().length === 0) {
    errors.push('Ürün adı gereklidir');
  } else if (name.length > 200) {
    errors.push('Ürün adı en fazla 200 karakter olabilir');
  }

  if (!description || description.trim().length === 0) {
    errors.push('Ürün açıklaması gereklidir');
  } else if (description.length > 1000) {
    errors.push('Ürün açıklaması en fazla 1000 karakter olabilir');
  }

  if (!categoryId) {
    errors.push('Kategori seçimi gereklidir');
  }

  // Price validation
  if (!price) {
    errors.push('Fiyat gereklidir');
  } else {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      errors.push('Geçerli bir fiyat giriniz (0 veya üzeri)');
    } else if (priceNum > 10000) {
      errors.push('Fiyat 10,000 TL\'den fazla olamaz');
    }
  }

  // Preparation time validation
  if (!preparationTime) {
    errors.push('Hazırlık süresi gereklidir');
  } else {
    const prepTime = parseInt(preparationTime);
    if (isNaN(prepTime) || prepTime < 1) {
      errors.push('Hazırlık süresi en az 1 dakika olmalıdır');
    } else if (prepTime > 300) {
      errors.push('Hazırlık süresi en fazla 300 dakika olabilir');
    }
  }

  // Optional field validations
  if (req.body.shortDescription && req.body.shortDescription.length > 200) {
    errors.push('Kısa açıklama en fazla 200 karakter olabilir');
  }

  if (req.body.ingredients && Array.isArray(req.body.ingredients)) {
    req.body.ingredients.forEach((ingredient: string, index: number) => {
      if (typeof ingredient !== 'string' || ingredient.trim().length === 0) {
        errors.push(`Malzeme ${index + 1} geçersiz`);
      } else if (ingredient.length > 100) {
        errors.push(`Malzeme ${index + 1} en fazla 100 karakter olabilir`);
      }
    });
  }

  if (req.body.allergens && Array.isArray(req.body.allergens)) {
    const validAllergens = ['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'fish', 'shellfish', 'sesame'];
    req.body.allergens.forEach((allergen: string) => {
      if (!validAllergens.includes(allergen)) {
        errors.push(`Geçersiz alerjen: ${allergen}`);
      }
    });
  }

  if (req.body.spiceLevel !== undefined) {
    const spiceLevel = parseInt(req.body.spiceLevel);
    if (![0, 1, 2, 3].includes(spiceLevel)) {
      errors.push('Baharat seviyesi 0-3 arasında olmalıdır');
    }
  }

  // Images validation
  if (req.body.images && Array.isArray(req.body.images)) {
    req.body.images.forEach((image: any, index: number) => {
      if (!image.url || !image.alt) {
        errors.push(`Resim ${index + 1} için URL ve alt text gereklidir`);
      } else if (!isValidImageUrl(image.url)) {
        errors.push(`Resim ${index + 1} geçersiz URL formatında`);
      }
    });
  }

  if (errors.length > 0) {
    throw new ApiError(400, `Validation hatası: ${errors.join(', ')}`);
  }

  next();
};

// 📝 Product Update Validation
export const validateProductUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = [];

  // Only validate provided fields
  if (req.body.name !== undefined) {
    if (typeof req.body.name !== 'string' || req.body.name.trim().length === 0) {
      errors.push('Ürün adı boş olamaz');
    } else if (req.body.name.length > 200) {
      errors.push('Ürün adı en fazla 200 karakter olabilir');
    }
  }

  if (req.body.description !== undefined) {
    if (typeof req.body.description !== 'string' || req.body.description.trim().length === 0) {
      errors.push('Ürün açıklaması boş olamaz');
    } else if (req.body.description.length > 1000) {
      errors.push('Ürün açıklaması en fazla 1000 karakter olabilir');
    }
  }

  if (req.body.price !== undefined) {
    const price = parseFloat(req.body.price);
    if (isNaN(price) || price < 0) {
      errors.push('Geçerli bir fiyat giriniz');
    } else if (price > 10000) {
      errors.push('Fiyat 10,000 TL\'den fazla olamaz');
    }
  }

  if (req.body.preparationTime !== undefined) {
    const prepTime = parseInt(req.body.preparationTime);
    if (isNaN(prepTime) || prepTime < 1 || prepTime > 300) {
      errors.push('Hazırlık süresi 1-300 dakika arasında olmalıdır');
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, `Validation hatası: ${errors.join(', ')}`);
  }

  next();
};

// 🔍 Query Parameters Validation
export const validateQueryParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = [];

  // Page validation
  if (req.query.page) {
    const page = parseInt(req.query.page as string);
    if (isNaN(page) || page < 1) {
      errors.push('Sayfa numarası 1 veya daha büyük olmalıdır');
    } else if (page > 1000) {
      errors.push('Sayfa numarası 1000\'den büyük olamaz');
    }
  }

  // Limit validation
  if (req.query.limit) {
    const limit = parseInt(req.query.limit as string);
    if (isNaN(limit) || limit < 1) {
      errors.push('Limit 1 veya daha büyük olmalıdır');
    } else if (limit > 100) {
      errors.push('Limit 100\'den büyük olamaz');
    }
  }

  // Price range validation
  if (req.query.minPrice) {
    const minPrice = parseFloat(req.query.minPrice as string);
    if (isNaN(minPrice) || minPrice < 0) {
      errors.push('Minimum fiyat 0 veya daha büyük olmalıdır');
    }
  }

  if (req.query.maxPrice) {
    const maxPrice = parseFloat(req.query.maxPrice as string);
    if (isNaN(maxPrice) || maxPrice < 0) {
      errors.push('Maksimum fiyat 0 veya daha büyük olmalıdır');
    }
  }

  if (req.query.minPrice && req.query.maxPrice) {
    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);
    if (minPrice > maxPrice) {
      errors.push('Minimum fiyat maksimum fiyattan büyük olamaz');
    }
  }

  // Sort validation
  if (req.query.sortBy) {
    const validSortFields = [
      'name', 'price', 'rating', 'orderCount', 'viewCount', 
      'preparationTime', 'createdAt', 'updatedAt'
    ];
    if (!validSortFields.includes(req.query.sortBy as string)) {
      errors.push(`Geçersiz sıralama alanı. Geçerli alanlar: ${validSortFields.join(', ')}`);
    }
  }

  if (req.query.sortOrder) {
    const sortOrder = req.query.sortOrder as string;
    if (!['asc', 'desc'].includes(sortOrder.toLowerCase())) {
      errors.push('Sıralama yönü asc veya desc olmalıdır');
    }
  }

  // Boolean field validation
  const booleanFields = ['isAvailable', 'isPopular', 'isFeatured', 'isActive'];
  booleanFields.forEach(field => {
    if (req.query[field]) {
      const value = req.query[field] as string;
      if (!['true', 'false'].includes(value.toLowerCase())) {
        errors.push(`${field} true veya false olmalıdır`);
      }
    }
  });

  if (errors.length > 0) {
    throw new ApiError(400, `Query validation hatası: ${errors.join(', ')}`);
  }

  next();
};

// 🆔 MongoDB ObjectId Validation
export const validateObjectId = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    
    if (!id) {
      throw new ApiError(400, `${paramName} parametresi gereklidir`);
    }

    // MongoDB ObjectId format check (24 karakter hexadecimal)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
      throw new ApiError(400, `Geçersiz ${paramName} formatı`);
    }

    next();
  };
};

// 🎯 General Input Sanitization
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Trim string fields
  const trimFields = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim();
    } else if (Array.isArray(obj)) {
      return obj.map(trimFields);
    } else if (obj && typeof obj === 'object') {
      const trimmed: any = {};
      for (const key in obj) {
        trimmed[key] = trimFields(obj[key]);
      }
      return trimmed;
    }
    return obj;
  };

  // Sanitize body
  if (req.body) {
    req.body = trimFields(req.body);
  }

  // Sanitize query
  if (req.query) {
    req.query = trimFields(req.query);
  }

  next();
};

// 🔍 Helper Functions
const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(urlObj.pathname);
  } catch {
    return false;
  }
};

// 📊 Rate Limiting Validation
export const validateRateLimit = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [ip, data] of requests.entries()) {
      if (data.resetTime < now) {
        requests.delete(ip);
      }
    }

    // Check current client
    const clientData = requests.get(clientIp);
    
    if (!clientData) {
      requests.set(clientIp, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (clientData.count >= maxRequests) {
      res.status(429).json({
        success: false,
        message: 'Çok fazla istek gönderildi',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
      return;
    }

    clientData.count++;
    next();
  };
};
