import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma database seeding for MySQL...');

  // 1. Seed Admins & Staff
  const initialAdmins = [
    {
      id: 'adm-1',
      email: 'admin@gmail.com',
      name: 'Admin',
      password: 'cinestar123',
      role: 'admin',
    },
    {
      id: 'adm-staff-1',
      email: 'blair@gmail.com',
      name: 'Blair',
      password: '123456',
      role: 'staff',
    },
    {
      id: 'adm-staff-2',
      email: 'tinkerbell@gmail.com',
      name: 'Tinkerbell',
      password: '123456',
      role: 'staff',
    },
    {
      id: 'adm-staff-3',
      email: 'luke@gmail.com',
      name: 'Luke',
      password: '123456',
      role: 'staff',
    },
  ];

  for (const adm of initialAdmins) {
    await prisma.admin.upsert({
      where: { email: adm.email.toLowerCase() },
      update: {
        name: adm.name,
        password: adm.password,
        role: adm.role,
      },
      create: {
        id: adm.id,
        email: adm.email.toLowerCase(),
        name: adm.name,
        password: adm.password,
        role: adm.role,
      },
    });
  }
  console.log(`✅ Seeded ${initialAdmins.length} admins/staff.`);

  // 2. Seed Sample Customers
  const initialCustomers = [
    {
      id: 'cust-1',
      name: 'John Doe',
      email: 'customer@cinestar.com',
      phone: '+1234567890',
      password: 'customer123',
      role: 'Customer',
      status: 'Active',
      bookingCount: 2,
    },
  ];

  for (const cust of initialCustomers) {
    await prisma.customer.upsert({
      where: { email: cust.email.toLowerCase() },
      update: {
        name: cust.name,
        phone: cust.phone,
        password: cust.password,
        status: cust.status,
        bookingCount: cust.bookingCount,
      },
      create: {
        id: cust.id,
        name: cust.name,
        email: cust.email.toLowerCase(),
        phone: cust.phone,
        password: cust.password,
        role: cust.role,
        status: cust.status,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        bookingCount: cust.bookingCount,
      },
    });
  }
  console.log(`✅ Seeded ${initialCustomers.length} initial customers.`);

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
