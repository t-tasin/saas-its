import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const dev = process.env.DEV_MODE === 'true';
    const issuer = process.env.JWT_ISSUER;
    const audience = process.env.JWT_AUDIENCE;
    const jwksUri = process.env.JWKS_URI;

    if (dev || !jwksUri) {
      // Dev: register a no-op verifier (we won't rely on it because the guard bypasses in DEV)
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Use a dummy secret/alg; guard handles dev bypass before verification is attempted
        secretOrKey: 'dev-secret',
        algorithms: ['HS256'],
        ignoreExpiration: true,
      });
    } else {
      // Prod/Stage: real RS256 verification via JWKS
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        issuer,
        audience,
        algorithms: ['RS256'],
        secretOrKeyProvider: jwksRsa.passportJwtSecret({
          jwksUri,
          cache: true,
          cacheMaxEntries: 5,
          cacheMaxAge: 10 * 60 * 1000,
          rateLimit: true,
          jwksRequestsPerMinute: 10,
        }),
        ignoreExpiration: false,
      });
    }
  }

  async validate(payload: any) {
    return {
      sub: payload?.sub,
      email: payload?.email,
      role: payload?.role || 'general', // general, operator, admin
      raw: payload,
    };
  }
}
