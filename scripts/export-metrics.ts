/**
 * Exports Redis metrics keys to CSV for resume/OKRs.
 * Run: tsx scripts/export-metrics.ts > metrics.csv
 */
import { createClient } from 'redis';

(async () => {
  const r = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
  await r.connect();
  const keys = await r.keys('metrics:*');
  console.log('service,method,route,count');
  for (const k of keys) {
    const count = await r.get(k);
    const [, service, method, route] = k.split(':');
    console.log(`${service},${method},${route},${count}`);
  }
  await r.quit();
})();
