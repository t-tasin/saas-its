/**
 * Sets the tenant into the Postgres session for the duration of a transaction
 * so RLS policies can enforce tenant isolation.
 *
 * Usage:
 *   return withTenant(tenantId, (tx) => tx.ticket.findMany(...));
 */
import { PrismaClient, Prisma } from '../generated/client';

export const prisma = new PrismaClient();

export async function withTenant<T>(
  tenantId: string,
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    // Use the SAFE tagged template, not Unsafe:
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, true)`;
    return fn(tx);
  });
}
