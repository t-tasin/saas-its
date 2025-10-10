import axios from 'axios';
import { E2E_CONFIG, TEST_USERS } from './e2e-config';

const BASE_URL = E2E_CONFIG.IDENTITY_URL;

describe('Authentication E2E Flow', () => {
  let generalUserTokens: { access: string; refresh: string };
  let operatorUserTokens: { access: string; refresh: string; tempToken?: string };

  describe('User Registration', () => {
    it('should register a new general user', async () => {
      const response = await axios.post(`${BASE_URL}/v1/auth/register`, {
        email: TEST_USERS.general.email,
        password: TEST_USERS.general.password,
        name: TEST_USERS.general.name,
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.email).toBe(TEST_USERS.general.email);
      expect(response.data.role).toBe('general');
      expect(response.data).not.toHaveProperty('password');
    });

    it('should fail to register with duplicate email', async () => {
      try {
        await axios.post(`${BASE_URL}/v1/auth/register`, {
          email: TEST_USERS.general.email,
          password: 'AnotherPassword123!',
          name: 'Another User',
        });
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response?.status).toBe(409);
      }
    });
  });

  describe('User Login - General User (Direct)', () => {
    it('should login general user and receive tokens', async () => {
      const response = await axios.post(`${BASE_URL}/v1/auth/login`, {
        email: TEST_USERS.general.email,
        password: TEST_USERS.general.password,
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('accessToken');
      expect(response.data).toHaveProperty('refreshToken');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user.role).toBe('general');

      generalUserTokens = {
        access: response.data.accessToken,
        refresh: response.data.refreshToken,
      };
    });

    it('should fail login with wrong password', async () => {
      try {
        await axios.post(`${BASE_URL}/v1/auth/login`, {
          email: TEST_USERS.general.email,
          password: 'WrongPassword123!',
        });
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response?.status).toBe(401);
      }
    });
  });

  describe('User Profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await axios.get(`${BASE_URL}/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${generalUserTokens.access}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.email).toBe(TEST_USERS.general.email);
    });

    it('should fail without authorization', async () => {
      try {
        await axios.get(`${BASE_URL}/v1/users/me`);
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response?.status).toBe(401);
      }
    });
  });

  describe('Token Refresh', () => {
    it('should refresh access token', async () => {
      const response = await axios.post(`${BASE_URL}/v1/auth/refresh`, {
        refreshToken: generalUserTokens.refresh,
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('accessToken');
      expect(response.data).toHaveProperty('refreshToken');

      // Update tokens
      generalUserTokens = {
        access: response.data.accessToken,
        refresh: response.data.refreshToken,
      };
    });
  });

  describe('Operator/Admin Two-Factor Authentication', () => {
    it('should register operator user (requires admin in production)', async () => {
      // For testing, we'll use the registration endpoint with role
      // In production, only admins can create operator/admin users
      const response = await axios.post(`${BASE_URL}/v1/auth/register`, {
        email: TEST_USERS.operator.email,
        password: TEST_USERS.operator.password,
        name: TEST_USERS.operator.name,
        role: 'operator', // This should work for testing
      });

      expect(response.status).toBe(201);
    });

    it('should login operator and receive tempToken', async () => {
      const response = await axios.post(`${BASE_URL}/v1/auth/login`, {
        email: TEST_USERS.operator.email,
        password: TEST_USERS.operator.password,
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('tempToken');
      expect(response.data.requiresOTP).toBe(true);

      operatorUserTokens = {
        access: '',
        refresh: '',
        tempToken: response.data.tempToken,
      };
    });

    it('should request OTP for operator', async () => {
      const response = await axios.post(
        `${BASE_URL}/v1/auth/otp/request`,
        {
          email: TEST_USERS.operator.email,
        },
        {
          headers: {
            Authorization: `Bearer ${operatorUserTokens.tempToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data).toHaveProperty('expiresIn');
    });

    // Note: In real tests, you'd need to retrieve the OTP from email or test database
    // For now, we'll skip the OTP verification as it requires email access
  });

  describe('Password Change', () => {
    it('should change password successfully', async () => {
      const newPassword = 'NewPassword123!';
      const response = await axios.post(
        `${BASE_URL}/v1/users/change-password`,
        {
          currentPassword: TEST_USERS.general.password,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${generalUserTokens.access}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Password changed successfully');

      // Verify can login with new password
      const loginResponse = await axios.post(`${BASE_URL}/v1/auth/login`, {
        email: TEST_USERS.general.email,
        password: newPassword,
      });

      expect(loginResponse.status).toBe(200);

      // Update back to original password for other tests
      await axios.post(
        `${BASE_URL}/v1/users/change-password`,
        {
          currentPassword: newPassword,
          newPassword: TEST_USERS.general.password,
        },
        {
          headers: {
            Authorization: `Bearer ${loginResponse.data.accessToken}`,
          },
        }
      );
    });
  });
});

