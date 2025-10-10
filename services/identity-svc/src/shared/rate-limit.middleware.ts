/**
 * Rate Limiting Middleware
 * Prevents abuse of OTP and login endpoints
 */
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly store = new Map<string, RateLimitEntry>();
  
  // Rate limit configurations
  private readonly limits = {
    otp: { maxRequests: 3, windowMs: 15 * 60 * 1000 }, // 3 requests per 15 minutes
    login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
    default: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  };

  use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;
    const identifier = this.getIdentifier(req);
    
    // Determine rate limit type based on path
    let limitConfig = this.limits.default;
    if (path.includes('/auth/request-otp') || path.includes('/auth/verify-otp')) {
      limitConfig = this.limits.otp;
    } else if (path.includes('/auth/login')) {
      limitConfig = this.limits.login;
    }

    const key = `${identifier}:${path}`;
    const now = Date.now();
    
    // Get or create rate limit entry
    let entry = this.store.get(key);
    
    if (!entry || now > entry.resetAt) {
      // Reset if expired or doesn't exist
      entry = {
        count: 0,
        resetAt: now + limitConfig.windowMs,
      };
    }

    // Increment counter
    entry.count++;
    this.store.set(key, entry);

    // Check if limit exceeded
    if (entry.count > limitConfig.maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      
      throw new HttpException(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', limitConfig.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (limitConfig.maxRequests - entry.count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000).toString());

    // Cleanup old entries periodically
    if (Math.random() < 0.01) { // 1% chance
      this.cleanup();
    }

    next();
  }

  /**
   * Get identifier for rate limiting (email from body or IP address)
   */
  private getIdentifier(req: Request): string {
    // Try to get email from request body
    if (req.body && req.body.email) {
      return req.body.email;
    }
    
    // Fall back to IP address
    return req.ip || req.connection.remoteAddress || 'unknown';
  }

  /**
   * Clean up expired entries
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear all rate limits (useful for testing)
   */
  clear() {
    this.store.clear();
  }
}

