/**
 * db.ts
 * Purpose: Prisma client instance for appointments-svc
 */
import { PrismaClient, Prisma } from '../generated/client/index.js';

export const prisma = new PrismaClient();
export type Tx = Prisma.TransactionClient;

