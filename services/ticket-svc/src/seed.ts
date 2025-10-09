/**
 * Seed tickets + comments for development.
 * Run: npm run seed
 */
import 'dotenv/config';
import { withTx } from './with-tenant';
import { TicketStatus, TicketType, TicketPriority } from './dto/ticket.dto';
import { TicketNumberService } from './ticket-number.service';

const num = new TicketNumberService();

async function main() {
  await withTx(async (tx) => {
    for (const t of [
      { title: 'Laptop not booting', type: TicketType.incident, priority: TicketPriority.high },
      { title: 'Need VPN access', type: TicketType.request, priority: TicketPriority.medium },
      { title: 'Email not syncing', type: TicketType.incident, priority: TicketPriority.low },
    ]) {
      const number = await num.next(tx);
      const ticket = await tx.ticket.upsert({
        where: { number },
        update: {},
        create: {
          number,
          title: t.title,
          type: t.type,
          priority: t.priority,
          status: TicketStatus.open,
          requestedBy: 'john.doe@example.com',
        },
      });
      await tx.ticketComment.create({
        data: {
          ticketId: ticket.id,
          authorName: 'John Doe',
          body: 'Initial report.',
        },
      });
    }
  });
  console.log('Seeded tickets');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
