/**
 * services/asset-svc/src/prisma.ts
 * Purpose: Service-local Prisma client using ../generated/client
 */
import { PrismaClient } from '../generated/client';
export const prisma = new PrismaClient();
export type Tx = Parameters<PrismaClient['$transaction']>[0];
