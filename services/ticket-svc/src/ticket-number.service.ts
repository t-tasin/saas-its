/**
 * ticket-number.service.ts
 * Location: services/ticket-svc/src/ticket-number.service.ts
 * Purpose: Generate ticket numbers in format TKT-YYYY-NNNNNN.
 * How: Uses TicketDayCounter table (repurposed as counter) inside the same transaction
 *      to safely increment a global counter (concurrency safe).
 */
import { Injectable } from '@nestjs/common';
import type { Tx } from './db';

@Injectable()
export class TicketNumberService {
  async next(tx: Tx): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    
    // Use a fixed key for the year to get sequential numbering
    const counterKey = `${year}`;
    
    const row = await tx.ticketDayCounter.upsert({
      where: { yymmdd: counterKey },
      create: { yymmdd: counterKey, seq: 1 },
      update: { seq: { increment: 1 } },
    });
    
    // Format: TKT-YYYY-NNNNNN (6-digit sequential number)
    return `TKT-${year}-${String(row.seq).padStart(6, '0')}`;
  }
}
