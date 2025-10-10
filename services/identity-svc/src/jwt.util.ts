/**
 * JWT Token Generation Utility
 * For production, you'd use a proper JWT library and signing keys
 * For now, we'll create simple tokens for dev/testing
 */
import * as crypto from 'crypto';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  name?: string;
}

/**
 * Generate a simple JWT-like token for development
 * In production, use proper JWT library with RS256 signing
 */
export function generateToken(user: { id: string; email: string; role: string; name?: string | null }): string {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    ...(user.name && { name: user.name }),
  };

  // For DEV: Create a base64 encoded token (NOT SECURE FOR PRODUCTION)
  const header = { alg: 'none', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  // In production, this would be a proper signature
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'dev-secret-key')
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Generate a refresh token (random string)
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a temporary token for two-factor authentication
 * Used for operator/admin login before OTP verification
 */
export function generateTempToken(user: { id: string; email: string; role: string }): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    temp: true,
    exp: Math.floor(Date.now() / 1000) + (5 * 60), // 5 minutes expiry
  };

  const header = { alg: 'none', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'dev-secret-key')
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode a temp token
 */
export function verifyTempToken(token: string): { sub: string; email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    
    // Check if it's a temp token and not expired
    if (!payload.temp) return null;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    return null;
  }
}

