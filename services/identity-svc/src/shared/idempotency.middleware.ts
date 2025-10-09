/**
 * Idempotency middleware:
 * - Reads Idempotency-Key header on POST/PATCH
 * - If seen, returns cached response body/status
 * - Else, captures response and caches for 24h
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.connect().catch(console.error);

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const method = req.method.toUpperCase();
    const key = req.header('Idempotency-Key');
    if (!key || (method !== 'POST' && method !== 'PATCH')) return next();

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
        await redis.set(cacheKey, JSON.stringify(payload), { EX: 60 * 60 * 24 });
      } catch (_) {}
      return origSend(body);
    };

    next();
  }
}
