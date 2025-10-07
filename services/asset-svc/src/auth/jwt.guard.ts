import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

function base64urlToJson(b64: string): any | null {
  try {
    const normalize = b64.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalize + '==='.slice((normalize.length + 3) % 4);
    const json = Buffer.from(pad, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}
function decodeUnsignedTokenOrRawBase64(token: string): any | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length >= 2) return base64urlToJson(parts[1]); // JWT-shaped
  try {
    const txt = Buffer.from(token, 'base64').toString('utf8'); // raw base64 json
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(private readonly reflector: Reflector) { super(); }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const devMode = process.env.DEV_MODE === 'true';

    if (devMode) {
      const headerTenant = req.header('x-tenant-id');
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

      if (headerTenant || (token && !token.includes('.'))) {
        const payload = headerTenant
          ? { tenant_id: headerTenant, sub: 'dev', roles: ['dev'] }
          : decodeUnsignedTokenOrRawBase64(token) || {};
        (req as any).user = {
          sub: payload.sub || 'dev',
          tenantId: payload.tenant_id || payload['custom:tenant_id'],
          roles: payload.roles || [],
          raw: payload,
        };
        return true;
      }

      if (token && token.includes('.')) {
        const payload = decodeUnsignedTokenOrRawBase64(token);
        if (payload) {
          (req as any).user = {
            sub: payload.sub || 'dev',
            tenantId: payload.tenant_id || payload['custom:tenant_id'],
            roles: payload.roles || [],
            raw: payload,
          };
          return true;
        }
      }
    }

    const res = await super.canActivate(context);
    return res as boolean;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) throw err || new UnauthorizedException('Invalid or missing token');
    return user;
  }
}
