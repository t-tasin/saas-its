export const E2E_CONFIG = {
  IDENTITY_URL: process.env.IDENTITY_URL || 'https://saas-itsidentity-svc-production.up.railway.app',
  TICKET_URL: process.env.TICKET_URL || 'https://saas-itsticket-svc-production.up.railway.app',
  ASSET_URL: process.env.ASSET_URL || 'https://asset-svc-production.up.railway.app',
  RESERVATION_URL: process.env.RESERVATION_URL || 'https://saas-itsreservation-svc-production.up.railway.app',
};

export const TEST_USERS = {
  general: {
    email: `test-general-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test General User',
    role: 'general',
  },
  operator: {
    email: `test-operator-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test Operator User',
    role: 'operator',
  },
  admin: {
    email: `test-admin-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test Admin User',
    role: 'admin',
  },
};

