/**
 * with-tenant.ts
 * Simple transaction wrapper (no tenant isolation - single institution mode)
 */
import { prisma, Tx } from './db';

export async function withTx<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    return fn(tx as unknown as Tx);
  });
}
