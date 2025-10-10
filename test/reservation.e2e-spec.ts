import axios from 'axios';
import { E2E_CONFIG, TEST_USERS } from './e2e-config';

const IDENTITY_URL = E2E_CONFIG.IDENTITY_URL;
const RESERVATION_URL = E2E_CONFIG.RESERVATION_URL;

describe('Reservation Flow E2E', () => {
  let generalUserToken: string;
  let operatorUserToken: string;
  let reservationId: string;
  let userId: string;

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

    const meResponse = await axios.get(`${IDENTITY_URL}/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${generalUserToken}`,
      },
    });
    userId = meResponse.data.id;

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
  });

  describe('Check Equipment Availability', () => {
    it('should check if equipment is available', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); // 7 days from now
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14); // 14 days from now

      const response = await axios.get(`${RESERVATION_URL}/v1/reservations/availability`, {
        headers: {
          Authorization: `Bearer ${generalUserToken}`,
        },
        params: {
          equipmentType: 'Laptop',
          quantity: 2,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('available');
      expect(response.data).toHaveProperty('totalQuantity');
      expect(response.data).toHaveProperty('availableQuantity');
    });
  });

  describe('Create Reservation', () => {
    it('should create a new reservation', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14);

      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations`,
        {
          equipmentType: 'Laptop',
          quantity: 2,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          purpose: 'Team training session',
        },
        {
          headers: {
            Authorization: `Bearer ${generalUserToken}`,
          },
        }
      );

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('reservationNumber');
      expect(response.data.reservationNumber).toMatch(/^RES-\d{4}-\d{3}$/);
      expect(response.data.status).toBe('pending');

      reservationId = response.data.id;
    });
  });

  describe('List Reservations', () => {
    it('should list reservations', async () => {
      const response = await axios.get(`${RESERVATION_URL}/v1/reservations`, {
        headers: {
          Authorization: `Bearer ${generalUserToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should filter reservations by status', async () => {
      const response = await axios.get(`${RESERVATION_URL}/v1/reservations`, {
        headers: {
          Authorization: `Bearer ${generalUserToken}`,
        },
        params: {
          status: 'pending',
        },
      });

      expect(response.status).toBe(200);
      response.data.forEach((reservation: any) => {
        expect(reservation.status).toBe('pending');
      });
    });
  });

  describe('Get Reservation Details', () => {
    it('should get reservation by ID', async () => {
      const response = await axios.get(`${RESERVATION_URL}/v1/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${generalUserToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(reservationId);
      expect(response.data.purpose).toContain('training');
    });
  });

  describe('Approve Reservation (Operator)', () => {
    it('should approve reservation', async () => {
      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations/${reservationId}/approve`,
        {
          notes: 'Approved for team training',
        },
        {
          headers: {
            Authorization: `Bearer ${operatorUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('approved');
      expect(response.data).toHaveProperty('approvedAt');
    });
  });

  describe('Activate Reservation', () => {
    it('should activate reservation', async () => {
      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations/${reservationId}/activate`,
        {
          assignedAssetIds: 'LAPTOP-001,LAPTOP-002',
        },
        {
          headers: {
            Authorization: `Bearer ${operatorUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('active');
      expect(response.data.assignedAssetIds).toBeTruthy();
    });
  });

  describe('Return Equipment', () => {
    it('should mark reservation as returned', async () => {
      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations/${reservationId}/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${operatorUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('returned');
      expect(response.data).toHaveProperty('returnedAt');
    });
  });

  describe('Deny Reservation Flow', () => {
    let denyReservationId: string;

    it('should create another reservation for denial test', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 30);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 35);

      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations`,
        {
          equipmentType: 'Projector',
          quantity: 1,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          purpose: 'Presentation',
        },
        {
          headers: {
            Authorization: `Bearer ${generalUserToken}`,
          },
        }
      );

      denyReservationId = response.data.id;
    });

    it('should deny reservation', async () => {
      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations/${denyReservationId}/deny`,
        {
          reason: 'Equipment not available for requested dates',
        },
        {
          headers: {
            Authorization: `Bearer ${operatorUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('denied');
    });
  });

  describe('Cancel Reservation', () => {
    let cancelReservationId: string;

    it('should create reservation for cancellation test', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 60);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 65);

      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations`,
        {
          equipmentType: 'Monitor',
          quantity: 1,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          purpose: 'Development work',
        },
        {
          headers: {
            Authorization: `Bearer ${generalUserToken}`,
          },
        }
      );

      cancelReservationId = response.data.id;
    });

    it('should cancel reservation', async () => {
      const response = await axios.post(
        `${RESERVATION_URL}/v1/reservations/${cancelReservationId}/cancel`,
        {
          reason: 'No longer needed',
        },
        {
          headers: {
            Authorization: `Bearer ${generalUserToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('cancelled');
      expect(response.data).toHaveProperty('cancelledAt');
      expect(response.data.cancellationReason).toBe('No longer needed');
    });
  });
});

