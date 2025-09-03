import mongoose, { Schema, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  IUserDocument, 
  IUserQuery, 
  IUserAddress, 
  IUserCreateInput 
} from '../types/user.types';

// 📍 User Address Schema
const userAddressSchema = new Schema<IUserAddress>({
  title: {
    type: String,
    required: [true, 'Adres başlığı gereklidir'],
    trim: true,
    maxlength: [50, 'Adres başlığı en fazla 50 karakter olabilir']
  },
  fullName: {
    type: String,
    required: [true, 'Ad soyad gereklidir'],
    trim: true,
    maxlength: [100, 'Ad soyad en fazla 100 karakter olabilir']
  },
  phone: {
    type: String,
    required: [true, 'Telefon numarası gereklidir'],
    validate: {
      validator: function(v: string) {
        return /^(\+90|0)?[5][0-9]{9}$/.test(v);
      },
      message: 'Geçerli bir Türkiye telefon numarası giriniz'
    }
  },
  city: {
    type: String,
    required: [true, 'Şehir gereklidir'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'İlçe gereklidir'],
    trim: true
  },
  neighborhood: {
    type: String,
    trim: true
  },
  street: {
    type: String,
    required: [true, 'Sokak bilgisi gereklidir'],
    trim: true
  },
  buildingNo: {
    type: String,
    required: [true, 'Bina numarası gereklidir'],
    trim: true
  },
  apartmentNo: String,
  floor: String,
  doorNo: String,
  directions: {
    type: String,
    maxlength: [500, 'Tarif en fazla 500 karakter olabilir']
  },
  coordinates: {
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
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: true // Alt-dokümanlarda _id oluştur
});

// 🧑‍💼 Main User Schema
const userSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: [true, 'E-posta adresi gereklidir'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Geçerli bir e-posta adresi giriniz'
    },
    index: true
  },
  password: {
    type: String,
    required: [true, 'Şifre gereklidir'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    select: false // Query'lerde varsayılan olarak gösterme
  },
  firstName: {
    type: String,
    required: [true, 'Ad gereklidir'],
    trim: true,
    maxlength: [50, 'Ad en fazla 50 karakter olabilir']
  },
  lastName: {
    type: String,
    required: [true, 'Soyad gereklidir'],
    trim: true,
    maxlength: [50, 'Soyad en fazla 50 karakter olabilir']
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^(\+90|0)?[5][0-9]{9}$/.test(v);
      },
      message: 'Geçerli bir Türkiye telefon numarası giriniz'
    }
  },
  role: {
    type: String,
    enum: {
      values: ['customer', 'admin', 'manager', 'staff'],
      message: 'Geçersiz kullanıcı rolü'
    },
    default: 'customer',
    index: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Geçerli bir resim URL\'si giriniz'
    }
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v: Date) {
        return !v || v < new Date();
      },
      message: 'Doğum tarihi gelecekte olamaz'
    }
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Geçersiz cinsiyet'
    }
  },
  
  // 🎯 User Preferences
  preferences: {
    language: {
      type: String,
      enum: ['tr', 'en'],
      default: 'tr'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    dietary: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'keto', 'diabetic']
    }]
  },
  
  // 📍 User Addresses
  addresses: [userAddressSchema],
  
  // 📊 User Statistics
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: [0, 'Sadakat puanı negatif olamaz']
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: [0, 'Toplam sipariş sayısı negatif olamaz']
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Toplam harcama negatif olamaz']
  },
  
  // 🔐 Authentication fields
  refreshTokens: [String],
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // 📊 User Analytics
  favoriteCategories: [String],
  averageOrderValue: {
    type: Number,
    default: 0
  },
  preferredOrderTimes: [{
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'late-night']
  }],
  frequentItems: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    orderCount: {
      type: Number,
      default: 0
    }
  }],
  
  // 🕐 Timestamps
  lastLoginAt: Date,
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true, // createdAt, updatedAt otomatik
  collection: 'users'
});

// 📇 Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ loyaltyPoints: -1 });
userSchema.index({ totalSpent: -1 });
userSchema.index({ createdAt: -1 });

// 🔐 Password hashing middleware
userSchema.pre('save', async function(next) {
  // Sadece password değiştirilmişse hash'le
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// 📧 Unique email index with custom error
userSchema.post('save', function(error: any, doc: any, next: any) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    if (error.keyPattern?.email) {
      next(new Error('Bu e-posta adresi zaten kullanımda'));
    } else {
      next(error);
    }
  } else {
    next(error);
  }
});

// 🔧 Instance Methods
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Şifre karşılaştırma hatası');
  }
};

userSchema.methods.generateAuthTokens = async function(): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = jwt.sign(
    { 
      userId: this._id, 
      email: this.email, 
      role: this.role 
    },
    process.env.JWT_SECRET!,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '15m' 
    }
  );
  
  const refreshToken = jwt.sign(
    { 
      userId: this._id, 
      type: 'refresh' 
    },
    process.env.JWT_REFRESH_SECRET!,
    { 
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' 
    }
  );
  
  // Refresh token'ı kaydet
  this.refreshTokens.push(refreshToken);
  await this.save();
  
  return { accessToken, refreshToken };
};

userSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  // Lock süresi geçmişse reset et
  if (this.lockUntil && this.lockUntil < new Date()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;
  }
  
  // 5 başarısız deneme sonrası 30 dakika kilitle
  if (this.loginAttempts >= 5 && !this.isLocked()) {
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 dakika
  }
  
  await this.save();
};

userSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

userSchema.methods.getFullName = function(): string {
  return `${this.firstName} ${this.lastName}`.trim();
};

userSchema.methods.getDefaultAddress = function(): IUserAddress | null {
  return this.addresses.find((addr: IUserAddress) => addr.isDefault) || null;
};

userSchema.methods.updateStats = async function(orderData: any): Promise<void> {
  this.totalOrders += 1;
  this.totalSpent += orderData.totalAmount;
  this.averageOrderValue = this.totalSpent / this.totalOrders;
  
  // Frequent items güncelle
  orderData.items.forEach((item: any) => {
    const existingItem = this.frequentItems.find((fi: any) => 
      fi.productId.toString() === item.productId.toString()
    );
    
    if (existingItem) {
      existingItem.orderCount += item.quantity;
    } else {
      this.frequentItems.push({
        productId: item.productId,
        orderCount: item.quantity
      });
    }
  });
  
  await this.save();
};

userSchema.methods.addLoyaltyPoints = async function(points: number): Promise<void> {
  this.loyaltyPoints += points;
  await this.save();
};

// 🔍 Static Query Methods
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

userSchema.statics.findByRole = function(role: string) {
  return this.find({ role, isActive: true });
};

userSchema.statics.searchByName = function(searchTerm: string) {
  const regex = new RegExp(searchTerm, 'i');
  return this.find({
    $or: [
      { firstName: regex },
      { lastName: regex },
      { email: regex }
    ],
    isActive: true
  });
};

// 🌟 Create and export the model
interface IUserModel extends Model<IUserDocument>, IUserQuery {}

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

// 🚀 Helper function for creating users
export const createUser = async (userData: IUserCreateInput): Promise<IUserDocument> => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error('Bu e-posta adresi zaten kullanımda');
    }
    throw error;
  }
};
