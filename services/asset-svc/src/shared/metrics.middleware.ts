/**
 * Very lightweight per-endpoint counter (in Redis) for quantifiable metrics.
 * Keys like: metrics:<service>:<method>:<route>
 * Export weekly via a tiny script to CSV for your resume/portfolio.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
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
