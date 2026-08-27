import { PrismaClient } from '@prisma/client';
import path from 'path';

// Force absolute path for SQLite on Vercel so it can always find dev.db
// Vercel serverless functions set process.cwd() to the root of the project
const dbPath = process.env.NODE_ENV === 'production' 
  ? `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`
  : 'file:./dev.db';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbPath,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
