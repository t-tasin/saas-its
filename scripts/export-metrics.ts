/**
 * Exports Redis metrics keys to CSV for resume/OKRs.
 * DISABLED: Redis is not currently used in production
 * 
 * To enable:
 * 1. Deploy Redis
 * 2. Uncomment code below
 * 3. npm install redis
 * 4. Run: tsx scripts/export-metrics.ts > metrics.csv
 */

console.log('Redis metrics export is currently disabled.');
console.log('Enable Redis in middleware and deploy Redis to use this script.');
process.exit(0);

/* REDIS IMPLEMENTATION (DISABLED)
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
*/
