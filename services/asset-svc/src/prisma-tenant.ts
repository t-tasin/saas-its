// services/asset-svc/src/prisma-tenant.ts (same idea for any service)
import { PrismaClient, Prisma } from '@prisma/client';

export const prisma = new PrismaClient();

/**
 * Runs `fn` inside a transaction after setting the session tenant.
 * Ensures all queries in `fn` are tenant-scoped via Postgres RLS.
 */
export async function withTenant<T>(
  tenantId: string,
  fn: (tx: Prisma.TransactionClient) => Promise<T>
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Parameterized & safe way to set the session variable
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, true)`;
    return fn(tx);
  });
}
