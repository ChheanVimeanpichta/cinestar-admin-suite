import { PrismaClient } from '@prisma/client';

const rawUrl =
  process.env.DATABASE_URL ??
  'mysql://admin:Pa$$w0rdPa$$w0rd@movie.cpys426owsu6.ap-southeast-1.rds.amazonaws.com:3306/cinestar?connect_timeout=30';

function buildDatabaseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('connect_timeout')) {
      parsed.searchParams.set('connect_timeout', '30');
    }
    if (!parsed.searchParams.has('pool_timeout')) {
      parsed.searchParams.set('pool_timeout', '30');
    }
    if (!parsed.searchParams.has('connection_limit')) {
      parsed.searchParams.set('connection_limit', '10');
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

const enhancedUrl = buildDatabaseUrl(rawUrl);

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
