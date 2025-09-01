import { Request, Response, NextFunction } from 'express';
import { Product, createProduct } from '../models/Product.model';
import { 
  IProductCreateInput, 
  IProductUpdateInput, 
  IProductSearchFilters 
} from '../types/product.types';

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

// 📄 GET /api/menu/products - Tüm ürünleri listele
export const getAllProducts = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    console.log('📄 GET /api/menu/products - Tüm ürünler isteniyor');
    
    // Query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;
    
    // Search filters
    const filters: any = { isActive: true };
    
    if (req.query.category) {
      filters.category = req.query.category;
    }
    
    if (req.query.isAvailable !== undefined) {
      filters.isAvailable = req.query.isAvailable === 'true';
    }
    
    if (req.query.isPopular !== undefined) {
      filters.isPopular = req.query.isPopular === 'true';
    }
    
    if (req.query.isFeatured !== undefined) {
      filters.isFeatured = req.query.isFeatured === 'true';
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) {
        filters.price.$gte = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        filters.price.$lte = parseFloat(req.query.maxPrice as string);
      }
    }
    
    // Text search
    if (req.query.search) {
      filters.$text = { $search: req.query.search as string };
    }
    
    // Sorting
    const sortField = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrder };
    
    console.log('🔍 Search filters:', filters);
    console.log('📊 Pagination:', { page, limit, skip });
    
    // Execute queries
    const [products, totalCount] = await Promise.all([
      Product.find(filters)
        .populate('category', 'name slug')
        .populate('createdBy', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filters)
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
    
    console.log(`✅ ${products.length} ürün bulundu`);
    
    sendResponse(res, 200, true, 'Ürünler başarıyla getirildi', products, pagination);
    
  } catch (error: any) {
    console.error('❌ Ürünler getirilirken hata:', error);
    next(error);
  }
};

// 🔍 GET /api/menu/products/:id - Tek ürün getir
export const getProductById = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/menu/products/${id} - Ürün detayı isteniyor`);
    
    const product = await Product.findOne({ _id: id, isActive: true })
      .populate('category', 'name slug description')
      .populate('createdBy', 'firstName lastName email');
    
    if (!product) {
      sendResponse(res, 404, false, 'Ürün bulunamadı');
      return;
    }
    
    // Increment view count
    await product.incrementViewCount();
    
    console.log(`✅ Ürün bulundu: ${product.name}`);
    sendResponse(res, 200, true, 'Ürün başarıyla getirildi', product);
    
  } catch (error: any) {
    console.error('❌ Ürün getirilirken hata:', error);
    next(error);
  }
};

// ➕ POST /api/menu/products - Yeni ürün oluştur
export const createNewProduct = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    console.log('➕ POST /api/menu/products - Yeni ürün oluşturuluyor');
    console.log('📝 Request body:', req.body);
    
    // Request validation
    const requiredFields = ['name', 'description', 'categoryId', 'price', 'preparationTime'];
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
    
    // Create product data
    const productData: IProductCreateInput = {
      name: req.body.name,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      categoryId: req.body.categoryId,
      price: parseFloat(req.body.price),
      images: req.body.images || [],
      ingredients: req.body.ingredients || [],
      allergens: req.body.allergens || [],
      preparationTime: parseInt(req.body.preparationTime),
      portions: req.body.portions || [],
      customizations: req.body.customizations || [],
      tags: req.body.tags || [],
      nutritionalInfo: req.body.nutritionalInfo
    };
    
    // Add createdBy field (would come from auth middleware)
    // For now, we'll use a placeholder
    const productWithCreator = {
      ...productData,
      createdBy: req.body.createdBy || '507f1f77bcf86cd799439011' // Placeholder ObjectId
    };
    
    const newProduct = await createProduct(productWithCreator);
    
    console.log(`✅ Yeni ürün oluşturuldu: ${newProduct.name} (ID: ${newProduct._id})`);
    
    sendResponse(res, 201, true, 'Ürün başarıyla oluşturuldu', newProduct);
    
  } catch (error: any) {
    console.error('❌ Ürün oluşturulurken hata:', error);
    
    if (error.message.includes('slug zaten kullanımda')) {
      sendResponse(res, 400, false, 'Bu ürün adı zaten kullanımda, farklı bir ad deneyin');
      return;
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      sendResponse(res, 400, false, 'Validation hatası', validationErrors);
      return;
    }
    
    next(error);
  }
};

// ✏️ PUT /api/menu/products/:id - Ürün güncelle
export const updateProduct = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`✏️ PUT /api/menu/products/${id} - Ürün güncelleniyor`);
    console.log('📝 Update data:', req.body);
    
    const updateData: IProductUpdateInput = {};
    
    // Only update fields that are provided
    const updateableFields = [
      'name', 'description', 'shortDescription', 'price', 'originalPrice',
      'isAvailable', 'isPopular', 'isFeatured', 'ingredients', 'allergens',
      'preparationTime', 'tags'
    ];
    
    updateableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field as keyof IProductUpdateInput] = req.body[field];
      }
    });
    
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, isActive: true },
      updateData,
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validations
      }
    ).populate('category', 'name slug');
    
    if (!updatedProduct) {
      sendResponse(res, 404, false, 'Ürün bulunamadı');
      return;
    }
    
    console.log(`✅ Ürün güncellendi: ${updatedProduct.name}`);
    sendResponse(res, 200, true, 'Ürün başarıyla güncellendi', updatedProduct);
    
  } catch (error: any) {
    console.error('❌ Ürün güncellenirken hata:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      sendResponse(res, 400, false, 'Validation hatası', validationErrors);
      return;
    }
    
    next(error);
  }
};

// 🗑️ DELETE /api/menu/products/:id - Ürün sil (soft delete)
export const deleteProduct = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/menu/products/${id} - Ürün siliniyor`);
    
    const deletedProduct = await Product.findOneAndUpdate(
      { _id: id, isActive: true },
      { 
        isActive: false,
        isAvailable: false // Also make it unavailable
      },
      { new: true }
    );
    
    if (!deletedProduct) {
      sendResponse(res, 404, false, 'Ürün bulunamadı');
      return;
    }
    
    console.log(`✅ Ürün silindi: ${deletedProduct.name}`);
    sendResponse(res, 200, true, 'Ürün başarıyla silindi', {
      id: deletedProduct._id,
      name: deletedProduct.name
    });
    
  } catch (error: any) {
    console.error('❌ Ürün silinirken hata:', error);
    next(error);
  }
};

// 🔍 GET /api/menu/products/search - Gelişmiş arama
export const searchProducts = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    console.log('🔍 GET /api/menu/products/search - Ürün arama');
    
    const {
      query,
      category,
      minPrice,
      maxPrice,
      tags,
      allergens,
      spiceLevel,
      maxPrepTime,
      minRating
    } = req.query;
    
    const filters: any = { isActive: true, isAvailable: true };
    
    // Text search
    if (query) {
      filters.$text = { $search: query as string };
    }
    
    // Category filter
    if (category) {
      filters.category = category;
    }
    
    // Price range
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice as string);
    }
    
    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filters.tags = { $in: tagArray };
    }
    
    // Allergens exclusion (exclude products WITH these allergens)
    if (allergens) {
      const allergenArray = Array.isArray(allergens) ? allergens : [allergens];
      filters.allergens = { $nin: allergenArray };
    }
    
    // Spice level filter
    if (spiceLevel) {
      const spiceLevels = Array.isArray(spiceLevel) 
        ? spiceLevel.map(Number) 
        : [parseInt(spiceLevel as string)];
      filters.spiceLevel = { $in: spiceLevels };
    }
    
    // Maximum preparation time
    if (maxPrepTime) {
      filters.preparationTime = { $lte: parseInt(maxPrepTime as string) };
    }
    
    // Minimum rating
    if (minRating) {
      filters['rating.average'] = { $gte: parseFloat(minRating as string) };
    }
    
    console.log('🔍 Advanced search filters:', filters);
    
    const products = await Product.find(filters)
      .populate('category', 'name slug')
      .sort({ 
        score: { $meta: 'textScore' }, // Text search relevance
        'rating.average': -1, // High rated first
        orderCount: -1 // Popular first
      })
      .limit(50); // Limit search results
    
    console.log(`✅ ${products.length} ürün bulundu`);
    
    sendResponse(res, 200, true, 'Arama tamamlandı', products);
    
  } catch (error: any) {
    console.error('❌ Ürün arama hatası:', error);
    next(error);
  }
};

// 🏆 GET /api/menu/products/featured - Öne çıkan ürünler
export const getFeaturedProducts = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    console.log('🏆 GET /api/menu/products/featured - Öne çıkan ürünler');
    
    const featuredProducts = await Product.findFeatured()
      .populate('category', 'name slug')
      .limit(12);
    
    console.log(`✅ ${featuredProducts.length} öne çıkan ürün bulundu`);
    
    sendResponse(res, 200, true, 'Öne çıkan ürünler getirildi', featuredProducts);
    
  } catch (error: any) {
    console.error('❌ Öne çıkan ürünler getirilirken hata:', error);
    next(error);
  }
};

// 🔥 GET /api/menu/products/popular - Popüler ürünler
export const getPopularProducts = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    console.log('🔥 GET /api/menu/products/popular - Popüler ürünler');
    
    const limit = Math.min(parseInt(req.query.limit as string) || 12, 50);
    
    const popularProducts = await Product.findPopular(limit)
      .populate('category', 'name slug');
    
    console.log(`✅ ${popularProducts.length} popüler ürün bulundu`);
    
    sendResponse(res, 200, true, 'Popüler ürünler getirildi', popularProducts);
    
  } catch (error: any) {
    console.error('❌ Popüler ürünler getirilirken hata:', error);
    next(error);
  }
};

// 📊 GET /api/menu/products/:id/analytics - Ürün analytics
export const getProductAnalytics = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`📊 GET /api/menu/products/${id}/analytics - Ürün analytics`);
    
    const product = await Product.findOne({ _id: id, isActive: true });
    
    if (!product) {
      sendResponse(res, 404, false, 'Ürün bulunamadı');
      return;
    }
    
    // Basic analytics data (in real implementation, this would come from analytics service)
    const analytics = {
      productId: product._id,
      productName: product.name,
      metrics: {
        totalViews: product.viewCount,
        totalOrders: product.orderCount,
        averageRating: product.rating.average,
        totalRatings: product.rating.count,
        conversionRate: product.viewCount > 0 
          ? ((product.orderCount / product.viewCount) * 100).toFixed(2) 
          : '0.00'
      },
      performance: {
        isPopular: product.isPopular,
        isFeatured: product.isFeatured,
        isAvailable: product.isAvailable,
        preparationTime: product.preparationTime
      },
      pricing: {
        currentPrice: product.price,
        originalPrice: product.originalPrice,
        discountPercentage: product.discountPercentage,
        profitMargin: product.profitMargin
      }
    };
    
    console.log(`✅ ${product.name} analytics getirildi`);
    
    sendResponse(res, 200, true, 'Ürün analytics getirildi', analytics);
    
  } catch (error: any) {
    console.error('❌ Ürün analytics getirilirken hata:', error);
    next(error);
  }
};
