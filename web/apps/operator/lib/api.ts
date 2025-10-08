// web/apps/operator/lib/api.ts
// Simple fetch wrapper that injects dev tenant header and JSON content-type.
const BASE_TICKETS = process.env.NEXT_PUBLIC_TICKET_API!;
const DEV_TENANT = '11111111-1111-1111-1111-111111111111';

export async function apiFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (process.env.NODE_ENV !== 'production') {
    headers.set('X-Tenant-Id', DEV_TENANT);
  }
  const res = await fetch(input, { ...init, headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res;
}

export const getTickets = async (): Promise<Ticket[]> =>
  (await apiFetch(`${BASE_TICKETS}/tickets`)).json();

export const getTicket = async (id: string): Promise<Ticket> =>
  (await apiFetch(`${BASE_TICKETS}/tickets/${id}`)).json();

export const getTicketComments = async (id: string): Promise<TicketComment[]> =>
  (await apiFetch(`${BASE_TICKETS}/tickets/${id}/comments`)).json();

export const postComment = async (id: string, body: string): Promise<TicketComment> =>
  (await apiFetch(`${BASE_TICKETS}/tickets/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  })).json();

export const patchTicketStatus = async (id: string, status: string): Promise<Ticket> =>
  (await apiFetch(`${BASE_TICKETS}/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })).json();

// ----- Types (inline for convenience) -----
export type Ticket = {
  id: string;
  tenantId: string;
  number: number;
  title: string;
  description?: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | string;
  type?: string | null;
  createdAt: string;
  updatedAt: string;
  // The following are future fields; UI tolerates undefined gracefully:
  requestedByName?: string | null; // "caller name"
  operatorName?: string | null;
  targetDate?: string | null;
  category?: string | null;
  subcategory?: string | null;
  operatorGroup?: string | null;
};

export type TicketComment = {
  id: string;
  tenantId: string;
  ticketId: string;
  authorId: string;
  body: string;
  createdAt: string;
};
