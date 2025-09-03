import { Request, Response, NextFunction } from 'express';

// 📊 Rate Limiting Interface
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    firstRequest: number;
  };
}

// 🛡️ Rate Limiting Class
class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;
  private message: string;
  private skipSuccessfulRequests: boolean;
  private skipFailedRequests: boolean;
  private cleanupInterval: NodeJS.Timeout;

  constructor(options: {
    windowMs: number;
    maxRequests: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
  }) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
    this.message = options.message || 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin';
    this.skipSuccessfulRequests = options.skipSuccessfulRequests || false;
    this.skipFailedRequests = options.skipFailedRequests || false;

    // Clean expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, data] of Object.entries(this.store)) {
      if (data.resetTime < now) {
        delete this.store[key];
      }
    }
  }

  private getKey(req: Request): string {
    // Use IP address as key, but could be enhanced with user ID for authenticated users
    return req.ip || req.connection.remoteAddress || 'unknown';
  }

  public middleware = (req: Request, res: Response, next: NextFunction): void => {
    const key = this.getKey(req);
    const now = Date.now();
    
    // Get or create rate limit data for this key
    let rateLimitData = this.store[key];
    
    if (!rateLimitData || rateLimitData.resetTime < now) {
      // Create new window
      rateLimitData = {
        count: 0,
        resetTime: now + this.windowMs,
        firstRequest: now
      };
      this.store[key] = rateLimitData;
    }

    // Check if limit exceeded
    if (rateLimitData.count >= this.maxRequests) {
      const resetTimeSeconds = Math.ceil((rateLimitData.resetTime - now) / 1000);
      
      res.status(429).json({
        success: false,
        message: this.message,
        retryAfter: resetTimeSeconds,
        limit: this.maxRequests,
        remaining: 0,
        resetTime: new Date(rateLimitData.resetTime).toISOString()
      });
      return;
    }

    // Increment counter
    rateLimitData.count++;

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': this.maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, this.maxRequests - rateLimitData.count).toString(),
      'X-RateLimit-Reset': new Date(rateLimitData.resetTime).toISOString(),
      'X-RateLimit-Window': this.windowMs.toString()
    });

    // Handle response to potentially skip counting
    if (this.skipSuccessfulRequests || this.skipFailedRequests) {
      const originalSend = res.json;
      res.json = function(body: any) {
        const statusCode = res.statusCode;
        
        // Skip counting based on response status
        if (
          (rateLimitData.count > 0) && 
          ((statusCode < 400 && rateLimitData.count > 0 && this.skipSuccessfulRequests) ||
           (statusCode >= 400 && this.skipFailedRequests))
        ) {
          rateLimitData.count--;
        }
        
        return originalSend.call(this, body);
      }.bind(res);
    }

    next();
  };

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store = {};
  }
}

// 🚀 Pre-configured rate limiters

// General API rate limiting
export const createGeneralRateLimit = () => new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
  message: 'Çok fazla API isteği gönderildi, 15 dakika sonra tekrar deneyin'
});

// Strict rate limiting for auth endpoints
export const createAuthRateLimit = () => new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Only 5 auth attempts per window
  message: 'Çok fazla giriş denemesi, 15 dakika sonra tekrar deneyin',
  skipSuccessfulRequests: true // Don't count successful logins against the limit
});

// Password reset rate limiting
export const createPasswordResetRateLimit = () => new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // Only 3 password reset attempts per hour
  message: 'Çok fazla şifre sıfırlama isteği, 1 saat sonra tekrar deneyin'
});

// Order creation rate limiting
export const createOrderRateLimit = () => new RateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 10, // 10 orders per 5 minutes
  message: 'Çok fazla sipariş isteği, 5 dakika sonra tekrar deneyin'
});

// Search rate limiting
export const createSearchRateLimit = () => new RateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 30, // 30 searches per minute
  message: 'Çok fazla arama isteği, 1 dakika sonra tekrar deneyin'
});

// Export middleware instances
export const generalRateLimit = createGeneralRateLimit().middleware;
export const authRateLimit = createAuthRateLimit().middleware;
export const passwordResetRateLimit = createPasswordResetRateLimit().middleware;
export const orderRateLimit = createOrderRateLimit().middleware;
export const searchRateLimit = createSearchRateLimit().middleware;

// Export class for custom configurations
export { RateLimiter };