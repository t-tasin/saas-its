/**
 * google-calendar.ts
 * Functions for interacting with Google Calendar API
 */
import { google } from 'googleapis';
import { getOAuth2Client } from './google-auth.js';
import { prisma } from './db.js';
import { logger } from './logger.js';

export interface TimeWindow {
  start: string; // ISO8601
  end: string;   // ISO8601
}

/**
 * Get authenticated calendar client for a technician
 */
async function getCalendarClient(technicianId: string) {
  const tech = await prisma.technician.findUniqueOrThrow({
    where: { id: technicianId },
  });
  
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: tech.googleRefreshToken,
  });
  
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Find busy time slots for a technician
 */
export async function getBusySlots(
  technicianId: string,
  timeMin: string,
  timeMax: string
): Promise<TimeWindow[]> {
  const calendar = await getCalendarClient(technicianId);
  const tech = await prisma.technician.findUniqueOrThrow({
    where: { id: technicianId },
  });
  
  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: tech.calendarId }],
      },
    });
    
    const busy = response.data.calendars?.[tech.calendarId]?.busy || [];
    return busy.map((slot: any) => ({
      start: slot.start!,
      end: slot.end!,
    }));
  } catch (error: any) {
    logger.error({ error, technicianId }, 'Failed to fetch busy slots');
    throw new Error(`Calendar API error: ${error.message}`);
  }
}

/**
 * Find first available slot within given windows
 */
export async function findAvailableSlot(
  technicianId: string,
  windows: TimeWindow[],
  durationMinutes: number,
  businessStart: string, // HH:mm
  businessEnd: string    // HH:mm
): Promise<TimeWindow | null> {
  for (const window of windows) {
    const windowStart = new Date(window.start);
    const windowEnd = new Date(window.end);
    
    // Get busy slots for this window
    const busySlots = await getBusySlots(
      technicianId,
      window.start,
      window.end
    );
    
    // Scan window in durationMinutes increments
    let current = new Date(windowStart);
    const slotDuration = durationMinutes * 60 * 1000; // ms
    
    while (current.getTime() + slotDuration <= windowEnd.getTime()) {
      const slotEnd = new Date(current.getTime() + slotDuration);
      
      // Check if within business hours
      const timeStr = current.toTimeString().substring(0, 5); // HH:mm
      if (timeStr < businessStart || timeStr >= businessEnd) {
        current = new Date(current.getTime() + 30 * 60 * 1000); // Skip 30 min
        continue;
      }
      
      // Check if slot overlaps with any busy slot
      const isOverlap = busySlots.some(busy => {
        const busyStart = new Date(busy.start).getTime();
        const busyEnd = new Date(busy.end).getTime();
        const slotStart = current.getTime();
        const slotEndTime = slotEnd.getTime();
        
        return !(slotEndTime <= busyStart || slotStart >= busyEnd);
      });
      
      if (!isOverlap) {
        // Found available slot!
        return {
          start: current.toISOString(),
          end: slotEnd.toISOString(),
        };
      }
      
      // Move to next slot
      current = new Date(current.getTime() + 30 * 60 * 1000); // 30-min increments
    }
  }
  
  return null; // No available slot found
}

/**
 * Create event in Google Calendar
 */
export async function createCalendarEvent(
  technicianId: string,
  appointment: {
    summary: string;
    description?: string;
    start: string;
    end: string;
    location: string;
    attendees: string[]; // Email addresses
  }
) {
  const calendar = await getCalendarClient(technicianId);
  const tech = await prisma.technician.findUniqueOrThrow({
    where: { id: technicianId },
  });
  
  try {
    const event = await calendar.events.insert({
      calendarId: tech.calendarId,
      requestBody: {
        summary: appointment.summary,
        description: appointment.description,
        location: appointment.location,
        start: {
          dateTime: appointment.start,
          timeZone: tech.timezone,
        },
        end: {
          dateTime: appointment.end,
          timeZone: tech.timezone,
        },
        attendees: appointment.attendees.map(email => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 },      // 30 min before
          ],
        },
      },
    });
    
    logger.info({ technicianId, eventId: event.data.id }, 'Calendar event created');
    
    return {
      eventId: event.data.id!,
      htmlLink: event.data.htmlLink!,
    };
  } catch (error: any) {
    logger.error({ error, technicianId }, 'Failed to create calendar event');
    throw new Error(`Calendar API error: ${error.message}`);
  }
}

/**
 * List events for a specific requester (by email)
 */
export async function listEventsForRequester(
  requesterEmail: string,
  timeMin: string,
  timeMax: string
) {
  // Query appointments from database where requester matches
  const appointments = await prisma.appointment.findMany({
    where: {
      requesterEmail,
      start: {
        gte: new Date(timeMin),
        lte: new Date(timeMax),
      },
    },
    include: {
      technician: true,
    },
    orderBy: {
      start: 'asc',
    },
  });
  
  return appointments;
}

