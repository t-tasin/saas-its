import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

export interface TenantContext { tenantId: string; sub?: string; roles: string[]; }
declare global { namespace Express { interface Request { tenant?: TenantContext } } }

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: () => void) {
    const u: any = (req as any).user || {};
    const dev = process.env.DEV_MODE === 'true';
    const headerTenant = dev ? req.header('x-tenant-id') : undefined;

    req.tenant = {
      tenantId: headerTenant || u.tenantId || '00000000-0000-0000-0000-000000000000',
      sub: u.sub,
      roles: u.roles || [],
    };
    next();
  }
}
