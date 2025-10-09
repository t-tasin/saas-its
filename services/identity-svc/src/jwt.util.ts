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

