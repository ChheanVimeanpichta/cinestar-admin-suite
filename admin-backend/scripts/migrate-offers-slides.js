import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function run() {
  console.log('Connecting to database:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

  console.log('Creating Offer table...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS \`Offer\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`title\` VARCHAR(191) NOT NULL,
      \`caption\` VARCHAR(191) NULL,
      \`badge\` VARCHAR(191) NULL DEFAULT 'SPECIAL OFFER',
      \`tag\` VARCHAR(191) NULL DEFAULT 'EXCLUSIVE',
      \`image\` LONGTEXT NOT NULL,
      \`icon\` VARCHAR(191) NULL DEFAULT '🍿',
      \`validity\` VARCHAR(191) NULL DEFAULT 'Limited Time',
      \`description\` TEXT NOT NULL,
      \`bullets\` TEXT NULL,
      \`publishDate\` VARCHAR(191) NULL,
      \`status\` VARCHAR(191) NOT NULL DEFAULT 'Active',
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
  console.log('✓ Offer table created or verified.');

  console.log('Creating Slide table...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS \`Slide\` (
      \`id\` VARCHAR(191) NOT NULL,
      \`title\` VARCHAR(191) NOT NULL,
      \`subtitle\` VARCHAR(191) NULL,
      \`description\` TEXT NOT NULL,
      \`image\` LONGTEXT NOT NULL,
      \`badges\` TEXT NULL,
      \`linkUrl\` VARCHAR(191) NULL DEFAULT '/movies',
      \`status\` VARCHAR(191) NOT NULL DEFAULT 'Active',
      \`order\` INT NOT NULL DEFAULT 0,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
  console.log('✓ Slide table created or verified.');

  const tables = await prisma.$queryRawUnsafe('SHOW TABLES;');
  console.log('All tables in database:', tables);
}

run()
  .catch((e) => {
    console.error('Error running migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
