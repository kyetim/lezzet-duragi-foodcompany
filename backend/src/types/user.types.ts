import { Document, Types } from 'mongoose';

// 🧑‍💼 User Base Interface
export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'admin' | 'manager' | 'staff';
  isEmailVerified: boolean;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  preferences: {
    language: 'tr' | 'en';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    dietary: string[]; // ['vegetarian', 'vegan', 'halal', 'gluten-free']
  };
  addresses: IUserAddress[];
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  lastLoginAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 📍 User Address Interface
export interface IUserAddress {
  _id?: Types.ObjectId;
  title: string; // 'Ev', 'İş', 'Diğer'
  fullName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood?: string;
  street: string;
  buildingNo: string;
  apartmentNo?: string;
  floor?: string;
  doorNo?: string;
  directions?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
}

// 🔐 Auth-related interfaces
export interface IUserAuth {
  refreshTokens: string[];
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
}

// 📊 User Statistics Interface
export interface IUserStats {
  favoriteCategories: string[];
  averageOrderValue: number;
  preferredOrderTimes: string[]; // ['breakfast', 'lunch', 'dinner', 'late-night']
  frequentItems: {
    productId: Types.ObjectId;
    orderCount: number;
  }[];
}

// 🌟 Combined User Document Interface (Mongoose Document)
export interface IUserDocument extends IUser, IUserAuth, IUserStats, Document {
  _id: Types.ObjectId;
  
  // 🔧 Instance Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthTokens(): Promise<{ accessToken: string; refreshToken: string }>;
  incrementLoginAttempts(): Promise<void>;
  isLocked(): boolean;
  
  // 📊 User analytics methods
  updateStats(orderData: any): Promise<void>;
  addLoyaltyPoints(points: number): Promise<void>;
  getFullName(): string;
  getDefaultAddress(): IUserAddress | null;
}

// 🔍 User Query Helpers
export interface IUserQuery {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findActive(): Promise<IUserDocument[]>;
  findByRole(role: string): Promise<IUserDocument[]>;
  searchByName(searchTerm: string): Promise<IUserDocument[]>;
}

// 🆕 User Creation Interface (Registration)
export interface IUserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'customer';
  preferences?: Partial<IUser['preferences']>;
}

// ✏️ User Update Interface
export interface IUserUpdateInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  preferences?: Partial<IUser['preferences']>;
}

// 🔑 Password-related interfaces
export interface IPasswordReset {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}

export interface IEmailVerification {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}
