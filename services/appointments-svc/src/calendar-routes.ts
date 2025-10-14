/**
 * calendar-routes.ts
 * Calendar viewing endpoints for frontend
 */
import { Router } from 'express';
import { listEventsForRequester } from './google-calendar.js';
import { logger } from './logger.js';

const router = Router();

/**
 * GET /calendar/events?userId=X&from=...&to=...
 * Get calendar events for a user (shows their appointments)
 */
router.get('/events', async (req, res) => {
  try {
    const { userId, requesterEmail, from, to } = req.query;
    
    if (!userId && !requesterEmail) {
      return res.status(400).json({ 
        error: 'userId or requesterEmail query parameter required' 
      });
    }
    
    // For now, we use requesterEmail to query appointments
    // In production, you'd map userId to email via identity-svc
    const email = requesterEmail as string || userId as string;
    
    const timeMin = from ? new Date(from as string).toISOString() : new Date().toISOString();
    const timeMax = to 
      ? new Date(to as string).toISOString() 
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days
    
    const appointments = await listEventsForRequester(email, timeMin, timeMax);
    
    // Transform to FullCalendar format
    const events = appointments.map(appt => ({
      id: appt.id,
      title: appt.summary,
      start: appt.start.toISOString(),
      end: appt.end.toISOString(),
      description: appt.description,
      location: appt.location,
      technician: {
        id: appt.technician.id,
        name: appt.technician.name,
        email: appt.technician.email,
      },
      backgroundColor: appt.technician.specialty === 'hardware' ? '#f59e0b' : '#3b82f6',
    }));
    
    return res.json({ events });
  } catch (error: any) {
    logger.error({ error }, 'Failed to get calendar events');
    return res.status(500).json({ error: 'Failed to get calendar events' });
  }
});

export const calendarRoutes = router;

