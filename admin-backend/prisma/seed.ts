import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.admin.createMany({
    data: [
      {
        email: 'admin@cinestar.com',
        password: 'changeme',
      },
    ],
    skipDuplicates: true,
  });
}

main().finally(() => prisma.$disconnect());
