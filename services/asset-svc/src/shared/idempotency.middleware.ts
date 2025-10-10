/**
 * Idempotency middleware:
 * - Reads Idempotency-Key header on POST/PATCH
 * - If seen, returns cached response body/status
 * - Else, captures response and caches for 24h
 * - Gracefully disables if Redis is unavailable
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { createClient } from 'redis';

let redis: ReturnType<typeof createClient> | null = null;
let redisAvailable = false;

// Try to connect to Redis, but don't crash if it's not available
(async () => {
  try {
    const client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    await client.connect();
    redis = client;
    redisAvailable = true;
    console.log('✅ Redis connected - Idempotency middleware enabled');
  } catch (err) {
    console.log('ℹ️  Redis unavailable - Idempotency middleware disabled');
  }
})();

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    // Skip if Redis is not available
    if (!redisAvailable || !redis) return next();

    const method = req.method.toUpperCase();
    const key = req.header('Idempotency-Key');
    if (!key || (method !== 'POST' && method !== 'PATCH')) return next();

    try {
      const cacheKey = `idem:${req.path}:${key}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        res.status(parsed.status).set(parsed.headers || {}).send(parsed.body);
        return;
      }

      // Capture response
      const origSend = res.send.bind(res);
      res.send = async (body: any) => {
        try {
          const payload = {
            status: res.statusCode,
            headers: { 'content-type': res.get('content-type') },
            body: typeof body === 'string' ? body : body?.toString?.() || body,
          };
          await redis!.set(cacheKey, JSON.stringify(payload), { EX: 60 * 60 * 24 });
        } catch (_) {}
        return origSend(body);
      };
    } catch (err) {
      // If Redis fails, just continue without caching
      console.error('Redis error in idempotency middleware:', err);
    }

    next();
  }
}
