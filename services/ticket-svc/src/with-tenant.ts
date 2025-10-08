// services/ticket-svc/src/with-tenant.ts
import { PrismaClient, Prisma } from '../generated/client';

export const prisma = new PrismaClient();

export async function withTenant<T>(
  tenantId: string,
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    const txx = tx as Prisma.TransactionClient;
    await txx.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, true)`;
    return fn(txx);
  });
}
