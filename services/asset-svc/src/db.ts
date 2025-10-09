/**
 * db.ts
 * Purpose: single source for Prisma client + Tx type in asset-svc.
 */
import { PrismaClient, Prisma } from '../generated/client';

export const prisma = new PrismaClient();
export type Tx = Prisma.TransactionClient;
