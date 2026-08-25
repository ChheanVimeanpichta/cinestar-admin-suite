import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🌱 Starting Prisma database seeding for MySQL...');

  const dataDir = path.resolve(__dirname, '../data');
  const adminsFile = path.join(dataDir, 'admins.json');
  const customersFile = path.join(dataDir, 'customers.json');

  // 1. Seed Admins & Staff
  if (fs.existsSync(adminsFile)) {
    const raw = fs.readFileSync(adminsFile, 'utf-8').trim().replace(/^\uFEFF/, '');
    if (raw) {
      const admins = JSON.parse(raw);
      for (const adm of admins) {
        await prisma.admin.upsert({
          where: { email: adm.email.toLowerCase() },
          update: {
            name: adm.name,
            password: adm.password,
            role: adm.role || 'staff',
          },
          create: {
            id: adm.id,
            email: adm.email.toLowerCase(),
            name: adm.name,
            password: adm.password,
            role: adm.role || 'staff',
            createdAt: adm.createdAt ? new Date(adm.createdAt) : new Date(),
          },
        });
      }
      console.log(`✅ Seeded ${admins.length} admins/staff.`);
    }
  }

  // 2. Seed Customers
  if (fs.existsSync(customersFile)) {
    const raw = fs.readFileSync(customersFile, 'utf-8').trim().replace(/^\uFEFF/, '');
    if (raw) {
      const customers = JSON.parse(raw);
      for (const cust of customers) {
        await prisma.customer.upsert({
          where: { email: cust.email.toLowerCase() },
          update: {
            name: cust.name,
            phone: cust.phone || null,
            password: cust.password || null,
            avatarUrl: cust.avatarUrl || null,
            status: cust.status || 'Active',
            joinDate: cust.joinDate || null,
            bookingCount: cust.bookingCount || 0,
          },
          create: {
            id: cust.id,
            name: cust.name,
            email: cust.email.toLowerCase(),
            phone: cust.phone || null,
            password: cust.password || null,
            avatarUrl: cust.avatarUrl || null,
            role: 'Customer',
            status: cust.status || 'Active',
            joinDate: cust.joinDate || null,
            bookingCount: cust.bookingCount || 0,
            createdAt: cust.createdAt ? new Date(cust.createdAt) : new Date(),
          },
        });
      }
      console.log(`✅ Seeded ${customers.length} customers.`);
    }
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

