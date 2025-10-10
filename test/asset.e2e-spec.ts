import axios from 'axios';
import { E2E_CONFIG, TEST_USERS } from './e2e-config';

const IDENTITY_URL = E2E_CONFIG.IDENTITY_URL;
const ASSET_URL = E2E_CONFIG.ASSET_URL;

describe('Asset Lifecycle E2E Flow', () => {
  let adminUserToken: string;
  let operatorUserToken: string;
  let userId: string;
  let assetId: string;

  beforeAll(async () => {
    // Register and login admin user
    await axios.post(`${IDENTITY_URL}/v1/auth/register`, {
      email: TEST_USERS.admin.email,
      password: TEST_USERS.admin.password,
      name: TEST_USERS.admin.name,
      role: 'admin',
    }).catch(() => {}); // May already exist

    const adminLogin = await axios.post(`${IDENTITY_URL}/v1/auth/login`, {
      email: TEST_USERS.admin.email,
      password: TEST_USERS.admin.password,
    });
    adminUserToken = adminLogin.data.accessToken || adminLogin.data.tempToken;

    // Register and login operator user
    await axios.post(`${IDENTITY_URL}/v1/auth/register`, {
      email: TEST_USERS.operator.email,
      password: TEST_USERS.operator.password,
      name: TEST_USERS.operator.name,
      role: 'operator',
    }).catch(() => {}); // May already exist

    const operatorLogin = await axios.post(`${IDENTITY_URL}/v1/auth/login`, {
      email: TEST_USERS.operator.email,
      password: TEST_USERS.operator.password,
    });
    operatorUserToken = operatorLogin.data.accessToken || operatorLogin.data.tempToken;

    // Get user ID for assignment
    const meResponse = await axios.get(`${IDENTITY_URL}/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${operatorUserToken}`,
      },
    });
    userId = meResponse.data.id;
  });

  describe('Create Asset', () => {
    it('should create a new asset (admin only)', async () => {
      const response = await axios.post(
        `${ASSET_URL}/v1/assets`,
        {
          assetId: `ASSET-TEST-${Date.now()}`,
          name: 'Dell Laptop XPS 15',
          assetType: 'Laptop',
          status: 'available',
          purchaseDate: new Date().toISOString(),
          purchaseCost: 1500,
          model: 'XPS 15 9520',
          serialNumber: `SN-${Date.now()}`,
          location: 'IT Department',
        },
        {
          headers: {
            Authorization: `Bearer ${adminUserToken}`,
          },
        }
      );

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toContain('Dell Laptop');
      expect(response.data.status).toBe('available');

      assetId = response.data.id;
    });
  });

  describe('List Assets', () => {
    it('should list assets with pagination', async () => {
      const response = await axios.get(`${ASSET_URL}/v1/assets`, {
        headers: {
          Authorization: `Bearer ${operatorUserToken}`,
        },
        params: {
          page: 1,
          limit: 10,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('assets');
      expect(Array.isArray(response.data.assets)).toBe(true);
    });

    it('should filter assets by status', async () => {
      const response = await axios.get(`${ASSET_URL}/v1/assets`, {
        headers: {
          Authorization: `Bearer ${operatorUserToken}`,
        },
        params: {
          status: 'available',
          page: 1,
          limit: 10,
        },
      });

      expect(response.status).toBe(200);
      response.data.assets.forEach((asset: any) => {
        expect(asset.status).toBe('available');
      });
    });
  });

  describe('Get Asset Types', () => {
    it('should get available asset types', async () => {
      const response = await axios.get(`${ASSET_URL}/v1/assets/types`, {
        headers: {
          Authorization: `Bearer ${operatorUserToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Assign Asset', () => {
    it('should assign asset to user', async () => {
      const response = await axios.post(
        `${ASSET_URL}/v1/assets/${assetId}/assign`,
        {
          userId,
          assignedAt: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${operatorUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('assigned');
      expect(response.data.assignedTo).toBe(userId);
    });

    it('should fail to assign already assigned asset', async () => {
      try {
        await axios.post(
          `${ASSET_URL}/v1/assets/${assetId}/assign`,
          {
            userId: 'another-user-id',
            assignedAt: new Date().toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${operatorUserToken}`,
            },
          }
        );
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response?.status).toBe(409);
      }
    });
  });

  describe('Get User Assets', () => {
    it('should get assets assigned to user', async () => {
      const response = await axios.get(`${ASSET_URL}/v1/assets/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${operatorUserToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0].assignedTo).toBe(userId);
    });
  });

  describe('Update Asset', () => {
    it('should update asset details', async () => {
      const response = await axios.patch(
        `${ASSET_URL}/v1/assets/${assetId}`,
        {
          location: 'Remote - Employee Home',
          notes: 'Assigned for remote work',
        },
        {
          headers: {
            Authorization: `Bearer ${adminUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.location).toBe('Remote - Employee Home');
    });
  });

  describe('Unassign Asset', () => {
    it('should unassign asset from user', async () => {
      const response = await axios.post(
        `${ASSET_URL}/v1/assets/${assetId}/unassign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${operatorUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('available');
      expect(response.data.assignedTo).toBeNull();
    });
  });

  describe('Asset Analytics', () => {
    it('should get asset analytics', async () => {
      const response = await axios.get(`${ASSET_URL}/v1/analytics/assets`, {
        headers: {
          Authorization: `Bearer ${operatorUserToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('totalAssets');
      expect(response.data).toHaveProperty('byStatus');
      expect(response.data).toHaveProperty('byType');
    });
  });

  describe('Delete Asset', () => {
    it('should delete asset (admin only)', async () => {
      const response = await axios.delete(`${ASSET_URL}/v1/assets/${assetId}`, {
        headers: {
          Authorization: `Bearer ${adminUserToken}`,
        },
      });

      expect(response.status).toBe(200);
    });
  });
});

