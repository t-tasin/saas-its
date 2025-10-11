/**
 * JwtAuthGuard
 * - @Public() handlers are skipped.
 * - Single-tenant DEV mode (DEV_MODE=true & SINGLE_TENANT_ID set): allow requests without a token,
 *   synthesize req.user { sub:'dev', tenantId:SINGLE_TENANT_ID, roles:['dev'] }.
 * - Otherwise in DEV: allow X-Tenant-Id header or base64 JSON "dev token".
 * - In PROD (or when rules above don’t apply): defer to passport-jwt (JWKS).
 */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

function base64urlToJson(b64: string): any | null {
  try {
    const normalize = b64.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalize + '==='.slice((normalize.length + 3) % 4);
    return JSON.parse(Buffer.from(pad, 'base64').toString('utf8'));
  } catch { return null; }
}
function decodeUnsignedTokenOrRawBase64(token: string): any | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length >= 2) return base64urlToJson(parts[1]); // JWT-shaped
  try { return JSON.parse(Buffer.from(token, 'base64').toString('utf8')); }
  catch { return null; }
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

    const req = context.switchToHttp().getRequest();
    const devMode = process.env.DEV_MODE === 'true';
    const singleTenant = process.env.SINGLE_TENANT_ID;

    // DEV mode: allow unsigned tokens or base64 JSON
    if (devMode) {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

      if (token) {
        const payload = decodeUnsignedTokenOrRawBase64(token) || {};
        (req as any).user = {
          sub: payload.sub || 'dev-user',
          email: payload.email || 'dev@example.com',
          role: payload.role || 'admin', // Default to admin in dev mode
          raw: payload,
        };
        return true; // Token processed, allow access
      }
      
      // If public endpoint and no token, allow without user
      if (isPublic) {
        return true;
      }
      
      // If no token in dev mode for protected endpoint, create a default dev user
      (req as any).user = {
        sub: 'dev-user',
        email: 'dev@example.com',
        role: 'admin',
        raw: { mode: 'dev-default' },
      };
      return true;
    }

    // For non-dev public endpoints, allow without authentication
    if (isPublic) return true;

    // PROD (or dev with real JWT): defer to passport-jwt strategy
    const res = await super.canActivate(context);
    return res as boolean;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) throw err || new UnauthorizedException('Invalid or missing token');
    return user;
  }
}
