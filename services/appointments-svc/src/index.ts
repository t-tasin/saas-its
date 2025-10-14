/**
 * appointments-svc
 * Microservice for managing IT appointments with Google Calendar integration
 */
import express from 'express';
import cors from 'cors';
import { googleAuthRoutes } from './google-auth.js';
import { bookingRoutes } from './booking.js';
import { calendarRoutes } from './calendar-routes.js';
import { logger } from './logger.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Configure for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check
app.get('/healthz', (_, res) => res.json({ ok: true, service: 'appointments-svc' }));

// Routes
app.use('/auth/google', googleAuthRoutes);
app.use('/appointments', bookingRoutes);
app.use('/calendar', calendarRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = Number(process.env.PORT || 3400);
app.listen(PORT, () => {
  logger.info({ PORT }, 'appointments-svc listening');
  logger.info('OAuth flow: /auth/google/start?technicianId=<ID>');
  logger.info('Book appointment: POST /appointments/auto');
  logger.info('View calendar: GET /calendar/events?requesterEmail=<email>');
});

