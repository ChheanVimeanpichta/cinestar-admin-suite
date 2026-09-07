import { PrismaClient } from '@prisma/client';

const rawUrl =
  process.env.DATABASE_URL ??
  'mysql://admin:Pa$$w0rdPa$$w0rd@movie.cpys426owsu6.ap-southeast-1.rds.amazonaws.com:3306/cinestar?connect_timeout=30';

const separator = rawUrl.includes('?') ? '&' : '?';
const enhancedUrl = rawUrl.includes('pool_timeout')
  ? rawUrl
  : `${rawUrl}${separator}pool_timeout=30&connect_timeout=30`;

export const dbConfig = {
  databaseUrl: enhancedUrl,
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: enhancedUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
