import { PrismaClient } from '../generated/client';

export const prisma = new PrismaClient();

export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

