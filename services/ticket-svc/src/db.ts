/**
 * db.ts
 * Purpose: single source for Prisma client instance and the Tx type.
 * IMPORTANT: always import Prisma from ../generated/client (NOT @prisma/client).
 */
import { PrismaClient, Prisma } from '../generated/client';

export const prisma = new PrismaClient();
export type Tx = Prisma.TransactionClient;
