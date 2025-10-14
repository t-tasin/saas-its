/**
 * booking.ts
 * Appointment booking endpoints
 */
import { Router } from 'express';
import { prisma } from './db.js';
import { logger } from './logger.js';
import { findAvailableSlot, createCalendarEvent } from './google-calendar.js';
import { generateICS } from './ics-generator.js';

const router = Router();

const APPT_DURATION = Number(process.env.APPT_DURATION || 30);
const BUSINESS_START = process.env.BUSINESS_START || '09:00';
const BUSINESS_END = process.env.BUSINESS_END || '17:00';
const APPT_LOCATION = process.env.APPT_LOCATION || 'IT Desk';
const DEFAULT_TZ = process.env.DEFAULT_TZ || 'America/New_York';

/**
 * POST /appointments/auto
 * Automatically find and book the first available slot
 */
router.post('/auto', async (req, res) => {
  try {
    const {
      technicianId,
      windows,
      durationMinutes = APPT_DURATION,
      requester,
      summary,
      description,
      location = APPT_LOCATION,
      timezone = DEFAULT_TZ,
      ticketId,
    } = req.body;
    
    // Validate required fields
    if (!technicianId || !windows || !requester || !summary) {
      return res.status(400).json({ 
        error: 'Missing required fields: technicianId, windows, requester, summary' 
      });
    }
    
    if (!requester.name || !requester.email) {
      return res.status(400).json({ 
        error: 'requester.name and requester.email are required' 
      });
    }
    
    // Find technician
    const technician = await prisma.technician.findUnique({
      where: { id: technicianId },
    });
    
    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    
    if (!technician.googleRefreshToken || technician.googleRefreshToken === 'PLACEHOLDER') {
      return res.status(503).json({ 
        error: 'Technician calendar not connected. Please complete OAuth setup first.',
        technicianId,
        oauthUrl: `/auth/google/start?technicianId=${technicianId}`
      });
    }
    
    // Find available slot
    logger.info({ technicianId, windows: windows.length }, 'Finding available slot');
    
    const slot = await findAvailableSlot(
      technicianId,
      windows,
      durationMinutes,
      BUSINESS_START,
      BUSINESS_END
    );
    
    if (!slot) {
      // No slot available - return 409 with suggested times
      return res.status(409).json({
        error: 'No available slots found in the provided windows',
        suggestion: 'Please try different time windows or contact support for manual scheduling',
        windows,
      });
    }
    
    logger.info({ technicianId, slot }, 'Available slot found');
    
    // Create Google Calendar event
    const { eventId, htmlLink } = await createCalendarEvent(technicianId, {
      summary,
      description,
      start: slot.start,
      end: slot.end,
      location,
      attendees: [requester.email],
    });
    
    // Save appointment to database
    const appointment = await prisma.appointment.create({
      data: {
        technicianId,
        ticketId: ticketId || '',
        requesterName: requester.name,
        requesterEmail: requester.email,
        start: new Date(slot.start),
        end: new Date(slot.end),
        summary,
        description,
        location,
        timezone,
        googleEventId: eventId,
      },
      include: {
        technician: true,
      },
    });
    
    logger.info({ appointmentId: appointment.id, eventId }, 'Appointment booked successfully');
    
    // Return appointment details
    return res.status(201).json({
      id: appointment.id,
      start: appointment.start.toISOString(),
      end: appointment.end.toISOString(),
      htmlLink,
      icsUrl: `${req.protocol}://${req.get('host')}/appointments/${appointment.id}.ics`,
      technician: {
        id: technician.id,
        name: technician.name,
        email: technician.email,
      },
      location: appointment.location,
      timezone: appointment.timezone,
    });
  } catch (error: any) {
    logger.error({ error }, 'Booking error');
    return res.status(500).json({ 
      error: error.message || 'Failed to book appointment' 
    });
  }
});

/**
 * GET /appointments/:id
 * Get appointment details
 */
router.get('/:id', async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: { technician: true },
    });
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    return res.json(appointment);
  } catch (error: any) {
    logger.error({ error }, 'Failed to get appointment');
    return res.status(500).json({ error: 'Failed to get appointment' });
  }
});

/**
 * GET /appointments/:id.ics
 * Download appointment as ICS file
 */
router.get('/:id.ics', async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: { technician: true },
    });
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const icsContent = generateICS(appointment);
    
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="appointment-${appointment.id}.ics"`);
    return res.send(icsContent);
  } catch (error: any) {
    logger.error({ error }, 'Failed to generate ICS');
    return res.status(500).json({ error: 'Failed to generate ICS file' });
  }
});

/**
 * GET /appointments
 * List appointments (with optional filters)
 */
router.get('/', async (req, res) => {
  try {
    const { technicianId, requesterEmail, from, to } = req.query;
    
    const where: any = {};
    
    if (technicianId) where.technicianId = technicianId as string;
    if (requesterEmail) where.requesterEmail = requesterEmail as string;
    if (from || to) {
      where.start = {};
      if (from) where.start.gte = new Date(from as string);
      if (to) where.start.lte = new Date(to as string);
    }
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: { technician: true },
      orderBy: { start: 'asc' },
    });
    
    return res.json({ appointments });
  } catch (error: any) {
    logger.error({ error }, 'Failed to list appointments');
    return res.status(500).json({ error: 'Failed to list appointments' });
  }
});

export const bookingRoutes = router;

