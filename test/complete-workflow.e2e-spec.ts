import axios from 'axios';
import { E2E_CONFIG } from './e2e-config';

const { IDENTITY_URL, TICKET_URL, ASSET_URL, RESERVATION_URL } = E2E_CONFIG;

describe('Complete Workflow E2E Test', () => {
  const timestamp = Date.now();
  const users = {
    general: {
      email: `workflow-general-${timestamp}@example.com`,
      password: 'WorkflowPass123!',
      name: 'Workflow General User',
      token: '',
      id: '',
    },
    operator: {
      email: `workflow-operator-${timestamp}@example.com`,
      password: 'WorkflowPass123!',
      name: 'Workflow Operator User',
      token: '',
      id: '',
    },
    admin: {
      email: `workflow-admin-${timestamp}@example.com`,
      password: 'WorkflowPass123!',
      name: 'Workflow Admin User',
      token: '',
      id: '',
    },
  };

  let assetId: string;
  let ticketId: string;
  let reservationId: string;

  describe('Step 1: User Registration & Authentication', () => {
    it('should register all users', async () => {
      // Register General User
      const generalReg = await axios.post(`${IDENTITY_URL}/v1/auth/register`, {
        email: users.general.email,
        password: users.general.password,
        name: users.general.name,
      });
      expect(generalReg.status).toBe(201);

      // Register Operator
      const operatorReg = await axios.post(`${IDENTITY_URL}/v1/auth/register`, {
        email: users.operator.email,
        password: users.operator.password,
        name: users.operator.name,
        role: 'operator',
      });
      expect(operatorReg.status).toBe(201);

      // Register Admin
      const adminReg = await axios.post(`${IDENTITY_URL}/v1/auth/register`, {
        email: users.admin.email,
        password: users.admin.password,
        name: users.admin.name,
        role: 'admin',
      });
      expect(adminReg.status).toBe(201);
    });

    it('should login all users and get tokens', async () => {
      // Login General
      const generalLogin = await axios.post(`${IDENTITY_URL}/v1/auth/login`, {
        email: users.general.email,
        password: users.general.password,
      });
      users.general.token = generalLogin.data.accessToken;
      users.general.id = generalLogin.data.user.id;

      // Login Operator
      const operatorLogin = await axios.post(`${IDENTITY_URL}/v1/auth/login`, {
        email: users.operator.email,
        password: users.operator.password,
      });
      users.operator.token = operatorLogin.data.accessToken || operatorLogin.data.tempToken;

      const opMe = await axios.get(`${IDENTITY_URL}/v1/users/me`, {
        headers: { Authorization: `Bearer ${users.operator.token}` },
      });
      users.operator.id = opMe.data.id;

      // Login Admin
      const adminLogin = await axios.post(`${IDENTITY_URL}/v1/auth/login`, {
        email: users.admin.email,
        password: users.admin.password,
      });
      users.admin.token = adminLogin.data.accessToken || adminLogin.data.tempToken;

      const adminMe = await axios.get(`${IDENTITY_URL}/v1/users/me`, {
        headers: { Authorization: `Bearer ${users.admin.token}` },
      });
      users.admin.id = adminMe.data.id;

      expect(users.general.token).toBeTruthy();
      expect(users.operator.token).toBeTruthy();
      expect(users.admin.token).toBeTruthy();
    });
  });

  describe('Step 2: Asset Management', () => {
    it('should create asset by admin', async () => {
      const response = await axios.post(
        `${ASSET_URL}/v1/assets`,
        {
          assetId: `WF-LAPTOP-${timestamp}`,
          name: 'Workflow Test Laptop',
          assetType: 'Laptop',
          status: 'available',
          purchaseDate: new Date().toISOString(),
          purchaseCost: 1200,
          model: 'ThinkPad X1',
          serialNumber: `WF-SN-${timestamp}`,
          location: 'IT Lab',
        },
        {
          headers: { Authorization: `Bearer ${users.admin.token}` },
        }
      );

      expect(response.status).toBe(201);
      assetId = response.data.id;
    });

    it('should assign asset to general user by operator', async () => {
      const response = await axios.post(
        `${ASSET_URL}/v1/assets/${assetId}/assign`,
        {
          userId: users.general.id,
          assignedAt: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${users.operator.token}` },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('assigned');
      expect(response.data.assignedTo).toBe(users.general.id);
    });

    it('should verify general user can see their assigned asset', async () => {
      const response = await axios.get(`${ASSET_URL}/v1/assets/user/${users.general.id}`, {
        headers: { Authorization: `Bearer ${users.general.token}` },
      });

      expect(response.status).toBe(200);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0].id).toBe(assetId);
    });
  });

  describe('Step 3: Ticket Creation & Resolution', () => {
    it('should create ticket for assigned asset', async () => {
      const response = await axios.post(
        `${TICKET_URL}/v1/tickets`,
        {
          title: 'Laptop keyboard issue',
          description: 'Some keys are not working properly on the assigned laptop',
          category: 'Hardware',
          priority: 'medium',
          requesterName: users.general.name,
          requesterEmail: users.general.email,
        },
        {
          headers: { Authorization: `Bearer ${users.general.token}` },
        }
      );

      expect(response.status).toBe(201);
      expect(response.data.ticketNumber).toMatch(/^TKT-\d{4}-\d{6}$/);
      ticketId = response.data.id;
    });

    it('should assign ticket to operator', async () => {
      const response = await axios.post(
        `${TICKET_URL}/v1/tickets/${ticketId}/assign`,
        {
          assignedToId: users.operator.id,
        },
        {
          headers: { Authorization: `Bearer ${users.operator.token}` },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('in_progress');
    });

    it('should add comment to ticket', async () => {
      const response = await axios.post(
        `${TICKET_URL}/v1/tickets/${ticketId}/comments`,
        {
          text: 'Investigating the keyboard issue. Will replace if necessary.',
          authorName: users.operator.name,
        },
        {
          headers: { Authorization: `Bearer ${users.operator.token}` },
        }
      );

      expect(response.status).toBe(201);
    });

    it('should resolve ticket', async () => {
      const response = await axios.patch(
        `${TICKET_URL}/v1/tickets/${ticketId}/status`,
        {
          status: 'resolved',
        },
        {
          headers: { Authorization: `Bearer ${users.operator.token}` },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('resolved');
    });
  });

  describe('Step 4: Equipment Reservation', () => {
    it('should check equipment availability', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 3);

      const response = await axios.get(`${RESERVATION_URL}/v1/reservations/availability`, {
        headers: { Authorization: `Bearer ${users.general.token}` },
        params: {
          equipmentType: 'Projector',
          quantity: 1,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('available');
    });

    it('should create reservation', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 3);

      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations`,
        {
          equipmentType: 'Projector',
          quantity: 1,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          purpose: 'Team presentation',
        },
        {
          headers: { Authorization: `Bearer ${users.general.token}` },
        }
      );

      expect(response.status).toBe(201);
      expect(response.data.reservationNumber).toMatch(/^RES-\d{4}-\d{3}$/);
      reservationId = response.data.id;
    });

    it('should approve reservation by operator', async () => {
      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations/${reservationId}/approve`,
        {
          notes: 'Approved for team presentation',
        },
        {
          headers: { Authorization: `Bearer ${users.operator.token}` },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('approved');
    });

    it('should activate reservation', async () => {
      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations/${reservationId}/activate`,
        {
          assignedAssetIds: 'PROJ-001',
        },
        {
          headers: { Authorization: `Bearer ${users.operator.token}` },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('active');
    });
  });

  describe('Step 5: Analytics & Reporting', () => {
    it('should get ticket analytics', async () => {
      const response = await axios.get(`${TICKET_URL}/v1/analytics/tickets`, {
        headers: { Authorization: `Bearer ${users.operator.token}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('totalTickets');
      expect(response.data).toHaveProperty('byStatus');
    });

    it('should get asset analytics', async () => {
      const response = await axios.get(`${ASSET_URL}/v1/analytics/assets`, {
        headers: { Authorization: `Bearer ${users.operator.token}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('totalAssets');
      expect(response.data).toHaveProperty('byStatus');
    });

    it('should get reservation analytics', async () => {
      const response = await axios.get(`${RESERVATION_URL}/v1/analytics/reservations`, {
        headers: { Authorization: `Bearer ${users.operator.token}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('totalReservations');
      expect(response.data).toHaveProperty('byStatus');
    });
  });

  describe('Step 6: Cleanup', () => {
    it('should return reserved equipment', async () => {
      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations/${reservationId}/return`,
        {},
        {
          headers: { Authorization: `Bearer ${users.operator.token}` },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('returned');
    });

    it('should unassign asset', async () => {
      const response = await axios.post(
        `${ASSET_URL}/v1/assets/${assetId}/unassign`,
        {},
        {
          headers: { Authorization: `Bearer ${users.operator.token}` },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('available');
    });

    it('should close ticket', async () => {
      const response = await axios.patch(
        `${TICKET_URL}/v1/tickets/${ticketId}/status`,
        {
          status: 'closed',
        },
        {
          headers: { Authorization: `Bearer ${users.operator.token}` },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('closed');
    });
  });
});

