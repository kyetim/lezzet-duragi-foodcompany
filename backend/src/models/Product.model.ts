import mongoose, { Schema, Model } from 'mongoose';
import {
  IProductDocument,
  IProductQuery,
  IProductImage,
  IProductPortion,
  IProductCustomization,
  ICustomizationOption,
  INutritionalInfo,
  IProductCreateInput
} from '../types/product.types';

// 🖼️ Product Image Schema
const productImageSchema = new Schema<IProductImage>({
  url: {
    type: String,
    required: [true, 'Resim URL\'si gereklidir'],
    validate: {
      validator: function (v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Geçerli bir resim URL\'si giriniz'
    }
  },
  alt: {
    type: String,
    required: [true, 'Resim alt text\'i gereklidir'],
    trim: true,
    maxlength: [200, 'Alt text en fazla 200 karakter olabilir']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Resim başlığı en fazla 100 karakter olabilir']
  },
  size: {
    width: {
      type: Number,
      min: [100, 'Resim genişliği en az 100px olmalıdır']
    },
    height: {
      type: Number,
      min: [100, 'Resim yüksekliği en az 100px olmalıdır']
    }
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isMain: {
    type: Boolean,
    default: false
  }
}, { _id: true });

// 🥗 Nutritional Info Schema
const nutritionalInfoSchema = new Schema<INutritionalInfo>({
  calories: {
    type: Number,
    required: [true, 'Kalori bilgisi gereklidir'],
    min: [0, 'Kalori negatif olamaz']
  },
  protein: {
    type: Number,
    required: [true, 'Protein bilgisi gereklidir'],
    min: [0, 'Protein negatif olamaz']
  },
  carbohydrates: {
    type: Number,
    required: [true, 'Karbonhidrat bilgisi gereklidir'],
    min: [0, 'Karbonhidrat negatif olamaz']
  },
  fat: {
    type: Number,
    required: [true, 'Yağ bilgisi gereklidir'],
    min: [0, 'Yağ negatif olamaz']
  },
  fiber: {
    type: Number,
    min: [0, 'Lif negatif olamaz']
  },
  sugar: {
    type: Number,
    min: [0, 'Şeker negatif olamaz']
  },
  sodium: {
    type: Number,
    min: [0, 'Sodyum negatif olamaz']
  },
  servingSize: {
    type: String,
    required: [true, 'Porsiyon büyüklüğü gereklidir'],
    trim: true
  }
}, { _id: false });

// 🍽️ Product Portion Schema
const productPortionSchema = new Schema<IProductPortion>({
  name: {
    type: String,
    required: [true, 'Porsiyon adı gereklidir'],
    trim: true,
    maxlength: [50, 'Porsiyon adı en fazla 50 karakter olabilir']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Porsiyon açıklaması en fazla 200 karakter olabilir']
  },
  priceModifier: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v: number) {
        return v >= -1000 && v <= 1000; // Makul fiyat değişimi
      },
      message: 'Fiyat değişimi -1000 ile 1000 arasında olmalıdır'
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { _id: true });

// ⚙️ Customization Option Schema
const customizationOptionSchema = new Schema<ICustomizationOption>({
  name: {
    type: String,
    required: [true, 'Seçenek adı gereklidir'],
    trim: true,
    maxlength: [100, 'Seçenek adı en fazla 100 karakter olabilir']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Seçenek açıklaması en fazla 200 karakter olabilir']
  },
  priceModifier: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v: number) {
        return v >= -100 && v <= 500; // Eklenti fiyat aralığı
      },
      message: 'Eklenti fiyatı -100 ile 500 arasında olmalıdır'
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { _id: true });

// 🔧 Product Customization Schema
const productCustomizationSchema = new Schema<IProductCustomization>({
  type: {
    type: String,
    required: [true, 'Özelleştirme tipi gereklidir'],
    enum: {
      values: ['addon', 'option', 'ingredient'],
      message: 'Geçersiz özelleştirme tipi'
    }
  },
  name: {
    type: String,
    required: [true, 'Özelleştirme adı gereklidir'],
    trim: true,
    maxlength: [100, 'Özelleştirme adı en fazla 100 karakter olabilir']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Özelleştirme açıklaması en fazla 300 karakter olabilir']
  },
  options: [customizationOptionSchema],
  isRequired: {
    type: Boolean,
    default: false
  },
  allowMultiple: {
    type: Boolean,
    default: false
  },
  maxSelections: {
    type: Number,
    min: [1, 'En az 1 seçim yapılabilmelidir'],
    validate: {
      validator: function (this: IProductCustomization, v: number) {
        return !this.allowMultiple || v > 0;
      },
      message: 'Çoklu seçimde maksimum seçim sayısı belirtilmelidir'
    }
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { _id: true });

// 🍽️ Main Product Schema
const productSchema = new Schema<IProductDocument>({
  name: {
    type: String,
    required: [true, 'Ürün adı gereklidir'],
    trim: true,
    maxlength: [200, 'Ürün adı en fazla 200 karakter olabilir'],
    index: true
  },
  slug: {
    type: String,
    required: [true, 'URL slug gereklidir'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v: string) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: 'Slug sadece küçük harf, rakam ve tire içerebilir'
    },
    index: true
  },
  description: {
    type: String,
    required: [true, 'Ürün açıklaması gereklidir'],
    trim: true,
    maxlength: [1000, 'Açıklama en fazla 1000 karakter olabilir']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Kısa açıklama en fazla 200 karakter olabilir']
  },

  // 🏷️ Category Information
  category: {
    type: Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: [true, 'Kategori gereklidir'],
    index: true
  },
  subCategory: {
    type: String,
    trim: true
  },

  // 💰 Pricing
  price: {
    type: Number,
    required: [true, 'Fiyat gereklidir'],
    min: [0, 'Fiyat negatif olamaz'],
    index: true
  },
  originalPrice: {
    type: Number,
    min: [0, 'Orijinal fiyat negatif olamaz']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'İndirim yüzdesi negatif olamaz'],
    max: [100, 'İndirim yüzdesi 100\'den büyük olamaz']
  },
  currency: {
    type: String,
    enum: {
      values: ['TRY', 'USD', 'EUR'],
      message: 'Geçersiz para birimi'
    },
    default: 'TRY'
  },

  // 🖼️ Media
  images: [productImageSchema],
  thumbnail: {
    type: String,
    validate: {
      validator: function (v: string) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Geçerli bir thumbnail URL\'si giriniz'
    }
  },

  // 📊 Product Details
  ingredients: [{
    type: String,
    trim: true,
    maxlength: [100, 'Malzeme adı en fazla 100 karakter olabilir']
  }],
  allergens: [{
    type: String,
    enum: {
      values: ['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'fish', 'shellfish', 'sesame'],
      message: 'Geçersiz alerjen tipi'
    }
  }],
  nutritionalInfo: nutritionalInfoSchema,
  preparationTime: {
    type: Number,
    required: [true, 'Hazırlık süresi gereklidir'],
    min: [1, 'Hazırlık süresi en az 1 dakika olmalıdır'],
    max: [300, 'Hazırlık süresi en fazla 300 dakika olabilir']
  },
  difficulty: {
    type: String,
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Geçersiz zorluk seviyesi'
    },
    default: 'easy'
  },
  spiceLevel: {
    type: Number,
    enum: {
      values: [0, 1, 2, 3],
      message: 'Baharat seviyesi 0-3 arasında olmalıdır'
    },
    default: 0,
    index: true
  },

  // 📏 Portion & Customization
  portions: [productPortionSchema],
  customizations: [productCustomizationSchema],

  // 🏷️ Tags & SEO
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO başlığı en fazla 60 karakter olabilir']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO açıklaması en fazla 160 karakter olabilir']
  },
  seoKeywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // 📊 Status & Availability
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  isPopular: {
    type: Boolean,
    default: false,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  // isNew: {
  //   type: Boolean,
  //   default: true,
  //   index: true
  // },

  // 📊 Analytics
  viewCount: {
    type: Number,
    default: 0,
    min: [0, 'Görüntüleme sayısı negatif olamaz']
  },
  orderCount: {
    type: Number,
    default: 0,
    min: [0, 'Sipariş sayısı negatif olamaz'],
    index: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Ortalama rating negatif olamaz'],
      max: [5, 'Ortalama rating 5\'ten büyük olamaz']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating sayısı negatif olamaz']
    },
    distribution: {
      5: { type: Number, default: 0, min: 0 },
      4: { type: Number, default: 0, min: 0 },
      3: { type: Number, default: 0, min: 0 },
      2: { type: Number, default: 0, min: 0 },
      1: { type: Number, default: 0, min: 0 }
    }
  },

  // 🎯 Business Rules
  minOrderQuantity: {
    type: Number,
    default: 1,
    min: [1, 'Minimum sipariş miktarı 1 olmalıdır']
  },
  maxOrderQuantity: {
    type: Number,
    min: [1, 'Maksimum sipariş miktarı en az 1 olmalıdır']
  },
  stockQuantity: {
    type: Number,
    min: [0, 'Stok miktarı negatif olamaz']
  },
  isStockTracked: {
    type: Boolean,
    default: false
  },

  // ⏰ Availability Schedule
  availableHours: {
    start: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Geçerli bir saat formatı giriniz (HH:MM)'
      }
    },
    end: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Geçerli bir saat formatı giriniz (HH:MM)'
      }
    },
    days: [{
      type: Number,
      min: [1, 'Gün 1-7 arasında olmalıdır'],
      max: [7, 'Gün 1-7 arasında olmalıdır']
    }]
  },

  // 📈 Business Metrics (Admin only)
  cost: {
    type: Number,
    min: [0, 'Maliyet negatif olamaz'],
    select: false // Sadece admin görebilir
  },
  profitMargin: {
    type: Number,
    min: [0, 'Kar marjı negatif olamaz'],
    max: [100, 'Kar marjı 100\'den büyük olamaz'],
    select: false // Sadece admin görebilir
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Oluşturan kullanıcı gereklidir']
  }
}, {
  timestamps: true,
  collection: 'products'
});

// 📇 Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // Text search
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ price: 1, isAvailable: 1 });
productSchema.index({ rating: -1, orderCount: -1 });
productSchema.index({ isPopular: 1, isFeatured: 1, isNew: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ createdAt: -1 });

// 🔧 Pre-save middleware
productSchema.pre('save', function (next) {
  // Auto-generate slug if not provided
  if (!(this as any).slug && (this as any).name) {
    (this as any).slug = (this as any).name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
      .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
      .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
      .trim('-'); // Baş ve sondaki tireleri kaldır
  }

  // Ensure at least one image is marked as main
  if ((this as any).images && (this as any).images.length > 0) {
    const hasMain = (this as any).images.some((img: any) => img.isMain);
    if (!hasMain) {
      (this as any).images[0].isMain = true;
    }
  }

  // Auto-set thumbnail from main image
  if (!(this as any).thumbnail && (this as any).images && (this as any).images.length > 0) {
    const mainImage = (this as any).images.find((img: any) => img.isMain);
    if (mainImage) {
      (this as any).thumbnail = mainImage.url;
    }
  }

  // Ensure at least one portion is marked as default
  if ((this as any).portions && (this as any).portions.length > 0) {
    const hasDefault = (this as any).portions.some((portion: any) => portion.isDefault);
    if (!hasDefault) {
      (this as any).portions[0].isDefault = true;
    }
  }

  next();
});

// 🔧 Instance Methods
productSchema.methods.calculateDiscountedPrice = function (): number {
  if (this.originalPrice && this.discountPercentage) {
    return Math.round((this.originalPrice * (100 - this.discountPercentage)) / 100);
  }
  return this.price;
};

productSchema.methods.getAvailablePortions = function (): IProductPortion[] {
  return this.portions || [];
};

productSchema.methods.isAvailableNow = function (): boolean {
  if (!this.isAvailable || !this.isActive) return false;

  if (!this.availableHours) return true;

  const now = new Date();
  const currentDay = now.getDay() || 7; // Sunday = 7
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  // Check if current day is in available days
  if (!this.availableHours.days.includes(currentDay)) return false;

  // Check if current time is in available hours
  const { start, end } = this.availableHours;
  if (start && end) {
    return currentTime >= start && currentTime <= end;
  }

  return true;
};

productSchema.methods.incrementViewCount = async function (): Promise<void> {
  this.viewCount += 1;
  await this.save();
};

productSchema.methods.updateRating = async function (newRating: number): Promise<void> {
  // Add to distribution
  this.rating.distribution[newRating as keyof typeof this.rating.distribution] += 1;
  this.rating.count += 1;

  // Recalculate average
  const totalStars =
    (this.rating.distribution[5] * 5) +
    (this.rating.distribution[4] * 4) +
    (this.rating.distribution[3] * 3) +
    (this.rating.distribution[2] * 2) +
    (this.rating.distribution[1] * 1);

  this.rating.average = Math.round((totalStars / this.rating.count) * 10) / 10;

  await this.save();
};

// 🔍 Static Query Methods
productSchema.statics.findByCategory = function (categoryId: string) {
  return this.find({
    category: categoryId,
    isActive: true,
    isAvailable: true
  }).populate('category');
};

productSchema.statics.findPopular = function (limit: number = 10) {
  return this.find({
    isPopular: true,
    isActive: true,
    isAvailable: true
  })
    .sort({ orderCount: -1, rating: -1 })
    .limit(limit);
};

productSchema.statics.findFeatured = function () {
  return this.find({
    isFeatured: true,
    isActive: true,
    isAvailable: true
  })
    .sort({ orderCount: -1 });
};

productSchema.statics.searchByName = function (searchTerm: string) {
  return this.find({
    $text: { $search: searchTerm },
    isActive: true,
    isAvailable: true
  })
    .sort({ score: { $meta: 'textScore' } });
};

productSchema.statics.findAvailable = function () {
  return this.find({
    isActive: true,
    isAvailable: true
  });
};

productSchema.statics.findBestSellers = function () {
  return this.find({
    isActive: true,
    isAvailable: true
  })
    .sort({ orderCount: -1, rating: -1 })
    .limit(20);
};

// 🌟 Create and export the model
interface IProductModel extends Model<IProductDocument>, IProductQuery { }

export const Product = mongoose.model<IProductDocument, IProductModel>('Product', productSchema);

// 🚀 Helper function for creating products
export const createProduct = async (productData: IProductCreateInput): Promise<IProductDocument> => {
  try {
    const product = new Product(productData);
    await product.save();
    return product;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error('Bu slug zaten kullanımda');
    }
    throw error;
  }
};
