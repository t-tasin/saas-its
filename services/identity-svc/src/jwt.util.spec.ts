import { generateToken, generateRefreshToken, generateTempToken, verifyTempToken } from './jwt.util';

describe('JWT Utilities', () => {
  describe('generateToken', () => {
    it('should generate a token with user information', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'general',
        name: 'Test User',
      };

      const token = generateToken(user);

      expect(token).toBeTruthy();
      expect(token.split('.')).toHaveLength(3);

      // Decode payload
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
      );

      expect(payload.sub).toBe(user.id);
      expect(payload.email).toBe(user.email);
      expect(payload.role).toBe(user.role);
      expect(payload.name).toBe(user.name);
    });

    it('should generate token without name if not provided', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'general',
        name: null,
      };

      const token = generateToken(user);
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
      );

      expect(payload.name).toBeUndefined();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a random refresh token', () => {
      const token1 = generateRefreshToken();
      const token2 = generateRefreshToken();

      expect(token1).toBeTruthy();
      expect(token2).toBeTruthy();
      expect(token1).not.toBe(token2);
      expect(token1).toHaveLength(64); // 32 bytes = 64 hex chars
    });
  });

  describe('generateTempToken', () => {
    it('should generate a temporary token with expiry', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'operator',
      };

      const token = generateTempToken(user);
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
      );

      expect(payload.sub).toBe(user.id);
      expect(payload.email).toBe(user.email);
      expect(payload.role).toBe(user.role);
      expect(payload.temp).toBe(true);
      expect(payload.exp).toBeTruthy();
    });
  });

  describe('verifyTempToken', () => {
    it('should verify and decode a valid temp token', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'operator',
      };

      const token = generateTempToken(user);
      const decoded = verifyTempToken(token);

      expect(decoded).toBeTruthy();
      expect(decoded?.sub).toBe(user.id);
      expect(decoded?.email).toBe(user.email);
      expect(decoded?.role).toBe(user.role);
    });

    it('should return null for invalid token format', () => {
      const result = verifyTempToken('invalid-token');

      expect(result).toBeNull();
    });

    it('should return null for non-temp token', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'general',
        name: 'Test User',
      };

      const regularToken = generateToken(user);
      const result = verifyTempToken(regularToken);

      expect(result).toBeNull();
    });

    it('should return null for expired temp token', () => {
      // Create an expired temp token manually
      const expiredPayload = {
        sub: '1',
        email: 'test@example.com',
        role: 'operator',
        temp: true,
        exp: Math.floor(Date.now() / 1000) - 100, // Expired 100 seconds ago
      };

      const header = { alg: 'none', typ: 'JWT' };
      const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
      const encodedPayload = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
      const expiredToken = `${encodedHeader}.${encodedPayload}.fake-signature`;

      const result = verifyTempToken(expiredToken);

      expect(result).toBeNull();
    });
  });
});

