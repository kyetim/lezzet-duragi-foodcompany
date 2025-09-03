import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// 🚨 Custom Error Class
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 🎯 Standard Error Response Interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    type?: string;
    details?: any;
    stack?: string;
  };
  timestamp: string;
  path: string;
  method: string;
}

// 🔍 MongoDB Validation Error Handler
const handleValidationError = (error: mongoose.Error.ValidationError): ApiError => {
  const errors = Object.values(error.errors).map((err: any) => ({
    field: err.path,
    message: err.message,
    value: err.value
  }));

  const message = `Validation hatası: ${errors.map(e => e.message).join(', ')}`;
  return new ApiError(400, message);
};

// 🔍 MongoDB Cast Error Handler (Invalid ObjectId)
const handleCastError = (error: mongoose.Error.CastError): ApiError => {
  const message = `Geçersiz ${error.path}: ${error.value}`;
  return new ApiError(400, message);
};

// 🔍 MongoDB Duplicate Key Error Handler
const handleDuplicateKeyError = (error: any): ApiError => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  const message = `${field} zaten kullanımda: ${value}`;
  return new ApiError(400, message);
};

// 🔍 JWT Error Handlers
const handleJWTError = (): ApiError => {
  return new ApiError(401, 'Geçersiz token, lütfen tekrar giriş yapın');
};

const handleJWTExpiredError = (): ApiError => {
  return new ApiError(401, 'Token süresi dolmuş, lütfen tekrar giriş yapın');
};

// 🎯 Main Error Handling Middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let err = { ...error };
  err.message = error.message;

  // Log error
  console.error('🚨 Error Handler:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    err = handleCastError(error);
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    err = handleValidationError(error);
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    err = handleDuplicateKeyError(error);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    err = handleJWTError();
  }

  if (error.name === 'TokenExpiredError') {
    err = handleJWTExpiredError();
  }

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: err.message || 'Sunucu hatası',
      statusCode: err.statusCode || 500,
      type: error.name || 'Error'
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Add details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.details = {
      originalError: error.message,
      stack: error.stack,
      body: req.body,
      params: req.params,
      query: req.query
    };
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && error.stack) {
    errorResponse.error.stack = error.stack;
  }

  res.status(err.statusCode || 500).json(errorResponse);
};

// 🔍 404 Not Found Handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new ApiError(404, `Route bulunamadı: ${req.originalUrl}`);
  next(error);
};

// 🚨 Async Error Wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 🎯 Success Response Helper
export const sendSuccess = <T>(
  res: Response,
  statusCode: number = 200,
  message: string,
  data?: T,
  meta?: any
): void => {
  const response: any = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (meta) {
    response.meta = meta;
  }

  res.status(statusCode).json(response);
};

// 🚫 Rate Limit Error Handler
export const handleRateLimitError = (req: Request, res: Response): void => {
  res.status(429).json({
    success: false,
    error: {
      message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin',
      statusCode: 429,
      type: 'RateLimitError'
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    retryAfter: '1 hour'
  });
};
