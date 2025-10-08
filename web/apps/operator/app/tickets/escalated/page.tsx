import { getTickets } from '../../../lib/api';
import TicketTable from '../../../components/tickets/TicketTable';

export const dynamic = 'force-dynamic';

export default async function EscalatedTicketsPage() {
  const tickets = await getTickets(); // TODO: filter server-side later

  return (
    <section className="mx-auto w-full max-w-6xl">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Escalated Tickets</h2>
        </div>
        <nav className="inline-flex items-center gap-0 rounded-md border border-neutral-300 bg-white p-0.5">
          <a
            href="/tickets"
            className="rounded-[6px] px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            Helpdesk
          </a>
          <a
            href="/tickets/escalated"
            aria-current="page"
            className="rounded-[6px] bg-neutral-900 px-3 py-1.5 text-sm text-white"
          >
            Escalated to me
          </a>
        </nav>
      </header>

      <TicketTable tickets={tickets} context="escalated" />
    </section>
  );
}
