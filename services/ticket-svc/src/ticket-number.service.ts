/**
 * ticket-number.service.ts
 * Location: services/ticket-svc/src/ticket-number.service.ts
 * Purpose: Generate per-day ticket numbers in format YYMMDD-####.
 * How: Uses TicketDayCounter table inside the same transaction to safely
 *      increment a daily counter (concurrency safe).
 */
import { Injectable } from '@nestjs/common';
import type { Tx } from './db';

@Injectable()
export class TicketNumberService {
  async next(tx: Tx): Promise<string> {
    const now = new Date();
    const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, '');
    const row = await tx.ticketDayCounter.upsert({
      where: { yymmdd },
      create: { yymmdd, seq: 1 },
      update: { seq: { increment: 1 } },
    });
    return `${yymmdd}-${String(row.seq).padStart(4, '0')}`;
  }
}
