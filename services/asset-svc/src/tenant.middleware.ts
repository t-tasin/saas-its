/**
 * TenantMiddleware (single-tenant aware)
 * - If SINGLE_TENANT_ID is set, always set req.tenant to that value (no headers/tokens needed).
 * - Else (multi-tenant mode), behave as before: in DEV require X-Tenant-Id; in PROD read from JWT claims.
 * - Health/docs/OPTIONS bypass the tenant check.
 */
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

export interface TenantContext { tenantId: string; sub?: string; roles: string[]; }
declare global { namespace Express { interface Request { tenant?: TenantContext } } }

// light UUID v4 validator
const isUuid = (s?: string) =>
  typeof s === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: () => void) {
    // --- bypass non-tenant endpoints
    const url = req.originalUrl || req.url || '';
    if (req.method === 'OPTIONS' || url.endsWith('/health') || url.includes('/docs')) {
      return next();
    }

    const user: any = (req as any).user || {};
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const sub = user.sub as string | undefined;

    // --- SINGLE TENANT MODE
    const single = process.env.SINGLE_TENANT_ID;
    if (single) {
      if (!isUuid(single)) {
        throw new BadRequestException('SINGLE_TENANT_ID must be a valid UUID');
      }
      req.tenant = { tenantId: single, sub, roles };
      return next();
    }

    // --- MULTI TENANT MODE (fallback)
    const dev = process.env.DEV_MODE === 'true';
    const headerTenant = dev ? (req.header('x-tenant-id') as string | undefined) : undefined;
    const claimTenant = user.tenantId || user.tenant_id || user['custom:tenant_id'];
    const tenantId = headerTenant || claimTenant;

    if (!tenantId || !isUuid(tenantId)) {
      throw new BadRequestException(
        dev ? 'X-Tenant-Id header (UUID) required in DEV_MODE' : 'Tenant context missing in token'
      );
    }

    req.tenant = { tenantId, sub, roles };
    next();
  }
}
