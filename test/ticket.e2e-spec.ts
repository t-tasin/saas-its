import axios from 'axios';
import { E2E_CONFIG, TEST_USERS } from './e2e-config';

const IDENTITY_URL = E2E_CONFIG.IDENTITY_URL;
const TICKET_URL = E2E_CONFIG.TICKET_URL;

describe('Ticket Lifecycle E2E Flow', () => {
  let generalUserToken: string;
  let operatorUserToken: string;
  let ticketId: string;
  let commentId: string;

  beforeAll(async () => {
    // Register and login general user
    await axios.post(`${IDENTITY_URL}/v1/auth/register`, {
      email: TEST_USERS.general.email,
      password: TEST_USERS.general.password,
      name: TEST_USERS.general.name,
    }).catch(() => {}); // May already exist

    const generalLogin = await axios.post(`${IDENTITY_URL}/v1/auth/login`, {
      email: TEST_USERS.general.email,
      password: TEST_USERS.general.password,
    });
    generalUserToken = generalLogin.data.accessToken;

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
    // For operator, may receive tempToken - handle both cases
    operatorUserToken = operatorLogin.data.accessToken || operatorLogin.data.tempToken;
  });

  describe('Create Ticket', () => {
    it('should create a new ticket', async () => {
      const response = await axios.post(
        `${TICKET_URL}/v1/tickets`,
        {
          title: 'Test Ticket - Network Issue',
          description: 'Cannot connect to wifi in building A',
          category: 'Network',
          priority: 'high',
          requesterName: TEST_USERS.general.name,
          requesterEmail: TEST_USERS.general.email,
        },
        {
          headers: {
            Authorization: `Bearer ${generalUserToken}`,
          },
        }
      );

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('ticketNumber');
      expect(response.data.ticketNumber).toMatch(/^TKT-\d{4}-\d{6}$/);
      expect(response.data.status).toBe('open');

      ticketId = response.data.id;
    });
  });

  describe('List Tickets', () => {
    it('should list tickets with pagination', async () => {
      const response = await axios.get(`${TICKET_URL}/v1/tickets`, {
        headers: {
          Authorization: `Bearer ${generalUserToken}`,
        },
        params: {
          page: 1,
          limit: 10,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('tickets');
      expect(response.data).toHaveProperty('total');
      expect(Array.isArray(response.data.tickets)).toBe(true);
    });

    it('should filter tickets by status', async () => {
      const response = await axios.get(`${TICKET_URL}/v1/tickets`, {
        headers: {
          Authorization: `Bearer ${generalUserToken}`,
        },
        params: {
          status: 'open',
          page: 1,
          limit: 10,
        },
      });

      expect(response.status).toBe(200);
      response.data.tickets.forEach((ticket: any) => {
        expect(ticket.status).toBe('open');
      });
    });
  });

  describe('Get Ticket Details', () => {
    it('should get ticket by ID', async () => {
      const response = await axios.get(`${TICKET_URL}/v1/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${generalUserToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(ticketId);
      expect(response.data.title).toContain('Network Issue');
    });
  });

  describe('Assign Ticket (Operator)', () => {
    it('should assign ticket to operator', async () => {
      const response = await axios.post(
        `${TICKET_URL}/v1/tickets/${ticketId}/assign`,
        {
          assignedToId: 'operator-user-id', // In real scenario, get from identity service
        },
        {
          headers: {
            Authorization: `Bearer ${operatorUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('in_progress');
    });
  });

  describe('Update Ticket Status', () => {
    it('should update ticket status to resolved', async () => {
      const response = await axios.patch(
        `${TICKET_URL}/v1/tickets/${ticketId}/status`,
        {
          status: 'resolved',
        },
        {
          headers: {
            Authorization: `Bearer ${operatorUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('resolved');
      expect(response.data).toHaveProperty('resolvedAt');
    });
  });

  describe('Add Comment', () => {
    it('should add comment to ticket', async () => {
      const response = await axios.post(
        `${TICKET_URL}/v1/tickets/${ticketId}/comments`,
        {
          text: 'Issue has been resolved by restarting the router.',
          authorName: TEST_USERS.operator.name,
        },
        {
          headers: {
            Authorization: `Bearer ${operatorUserToken}`,
          },
        }
      );

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.text).toContain('resolved');

      commentId = response.data.id;
    });
  });

  describe('S3 Attachment Operations', () => {
    it('should request attachment upload URL', async () => {
      const response = await axios.post(
        `${TICKET_URL}/v1/tickets/${ticketId}/attachments/upload`,
        {
          filename: 'screenshot.png',
          contentType: 'image/png',
        },
        {
          headers: {
            Authorization: `Bearer ${generalUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('uploadUrl');
      expect(response.data).toHaveProperty('key');
      expect(response.data).toHaveProperty('attachmentId');
    });

    it('should request attachment download URL', async () => {
      const key = `tickets/${ticketId}/test-uuid/screenshot.png`;
      const response = await axios.get(
        `${TICKET_URL}/v1/tickets/${ticketId}/attachments/${encodeURIComponent(key)}`,
        {
          headers: {
            Authorization: `Bearer ${generalUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('downloadUrl');
    });
  });

  describe('Close Ticket', () => {
    it('should close ticket', async () => {
      const response = await axios.patch(
        `${TICKET_URL}/v1/tickets/${ticketId}/status`,
        {
          status: 'closed',
        },
        {
          headers: {
            Authorization: `Bearer ${operatorUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('closed');
      expect(response.data).toHaveProperty('closedAt');
    });
  });
});

