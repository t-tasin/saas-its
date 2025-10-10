/**
 * Idempotency middleware (No-Op version - Redis disabled)
 * To enable idempotency with Redis:
 * 1. Add REDIS_URL to environment variables
 * 2. Uncomment Redis implementation below
 * 3. npm install redis
 */
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    // Redis disabled - pass through all requests
    next();
  }
}

/* REDIS IMPLEMENTATION (DISABLED)
import { createClient } from 'redis';

let redis: ReturnType<typeof createClient> | null = null;
let redisAvailable = false;

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
      console.error('Redis error in idempotency middleware:', err);
    }

    next();
  }
}
*/
