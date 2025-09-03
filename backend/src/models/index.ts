// 🗄️ Database Models Export Hub
// Bu dosya tüm MongoDB modellerini tek yerden export eder

export { User, createUser } from './User.model';
export { Product, createProduct } from './Product.model';
export { Order, createOrder } from './Order.model';

// 📊 Type exports
export type { IUserDocument } from '../types/user.types';
export type { IProductDocument } from '../types/product.types';
export type { IOrderDocument } from '../types/order.types';

// 🎯 Quick reference for available models:
/*
  📧 User Model:
  - User registration, authentication
  - Profile management, addresses
  - Loyalty points, order history
  
  🍽️ Product Model:
  - Menu items, categories
  - Pricing, portions, customizations
  - Ratings, availability, analytics
  
  🛒 Order Model:
  - Order management, tracking
  - Payment processing, status updates
  - Customer feedback, issue resolution
*/
