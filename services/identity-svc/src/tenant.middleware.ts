import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

export interface TenantContext { tenantId: string; sub?: string; roles: string[]; }
declare global { namespace Express { interface Request { tenant?: TenantContext } } }

// very light UUID v4-ish validator (enough for our case)
const isUuid = (s?: string) => typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: () => void) {
    const dev = process.env.DEV_MODE === 'true';
    const user: any = (req as any).user || {};

    // Prefer JWT claims; allow header ONLY in dev
    const headerTenant = dev ? (req.header('x-tenant-id') as string | undefined) : undefined;
    const claimTenant =
      user.tenantId ||
      user.tenant_id ||
      user['custom:tenant_id'];

    const tenantId = headerTenant || claimTenant;

    if (!tenantId || !isUuid(tenantId)) {
      // Fail fast — RLS requires a valid tenant id
      throw new BadRequestException(
        dev
          ? 'X-Tenant-Id header (UUID) required in DEV_MODE'
          : 'Tenant context missing in token'
      );
    }

    const roles = Array.isArray(user.roles) ? user.roles : [];
    const sub = user.sub as string | undefined;

    req.tenant = { tenantId, sub, roles };
    next();
  }
}
