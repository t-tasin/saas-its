/**
 * ics-generator.ts
 * Generate ICS calendar files for appointments
 */
import { createEvents, EventAttributes } from 'ics';

export function generateICS(appointment: any): string {
  const start = new Date(appointment.start);
  const end = new Date(appointment.end);
  
  const event: EventAttributes = {
    start: [
      start.getFullYear(),
      start.getMonth() + 1,
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
    ],
    end: [
      end.getFullYear(),
      end.getMonth() + 1,
      end.getDate(),
      end.getHours(),
      end.getMinutes(),
    ],
    title: appointment.summary,
    description: appointment.description || '',
    location: appointment.location,
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: { 
      name: appointment.technician.name, 
      email: appointment.technician.email 
    },
    attendees: [
      {
        name: appointment.requesterName,
        email: appointment.requesterEmail,
        rsvp: true,
      },
    ],
  };
  
  const { error, value } = createEvents([event]);
  
  if (error) {
    throw new Error(`ICS generation error: ${error.message}`);
  }
  
  return value || '';
}

