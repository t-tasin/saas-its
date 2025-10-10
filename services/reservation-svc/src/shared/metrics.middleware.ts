/**
 * Metrics middleware (No-Op version - Redis disabled)
 * To enable metrics with Redis:
 * 1. Add REDIS_URL to environment variables
 * 2. Uncomment Redis implementation below
 * 3. npm install redis
 */
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    // Redis disabled - pass through all requests
    next();
  }
}

/* REDIS IMPLEMENTATION (DISABLED)
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.connect().catch(console.error);

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const route = (req.route?.path || req.path || '').replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
    const key = `metrics:${process.env.SERVICE_NAME || 'svc'}:${req.method}:${route}`;
    redis.incr(key).catch(() => {});
    next();
  }
}
*/
