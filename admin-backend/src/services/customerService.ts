import { prisma } from '../config/db.js';

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  avatarUrl?: string;
  role: 'Customer';
  status: 'Active' | 'Suspended';
  joinDate: string;
  bookingCount: number;
  createdAt: string;
}

export const getAllCustomers = async (): Promise<CustomerAccount[]> => {
  const dbCustomers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return dbCustomers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email.toLowerCase(),
    phone: c.phone || '',
    password: c.password || '',
    avatarUrl: (c as any).avatarUrl || '',
    role: 'Customer',
    status: (c.status === 'Suspended' ? 'Suspended' : 'Active') as 'Active' | 'Suspended',
    joinDate: c.joinDate || new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    bookingCount: c.bookingCount || 0,
    createdAt: c.createdAt.toISOString(),
  }));
};

export const findCustomerByEmail = async (email: string): Promise<CustomerAccount | undefined> => {
  const normalizedEmail = email.toLowerCase();
  const dbCustomer = await prisma.customer.findUnique({
    where: { email: normalizedEmail },
  });
  if (!dbCustomer) return undefined;
  return {
    id: dbCustomer.id,
    name: dbCustomer.name,
    email: dbCustomer.email.toLowerCase(),
    phone: dbCustomer.phone || '',
    password: dbCustomer.password || '',
    avatarUrl: (dbCustomer as any).avatarUrl || '',
    role: 'Customer',
    status: (dbCustomer.status === 'Suspended' ? 'Suspended' : 'Active') as 'Active' | 'Suspended',
    joinDate: dbCustomer.joinDate || new Date(dbCustomer.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    bookingCount: dbCustomer.bookingCount || 0,
    createdAt: dbCustomer.createdAt.toISOString(),
  };
};

export const findCustomerById = async (id: string): Promise<CustomerAccount | undefined> => {
  const dbCustomer = await prisma.customer.findUnique({
    where: { id },
  });
  if (!dbCustomer) return undefined;
  return {
    id: dbCustomer.id,
    name: dbCustomer.name,
    email: dbCustomer.email.toLowerCase(),
    phone: dbCustomer.phone || '',
    password: dbCustomer.password || '',
    avatarUrl: (dbCustomer as any).avatarUrl || '',
    role: 'Customer',
    status: (dbCustomer.status === 'Suspended' ? 'Suspended' : 'Active') as 'Active' | 'Suspended',
    joinDate: dbCustomer.joinDate || new Date(dbCustomer.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    bookingCount: dbCustomer.bookingCount || 0,
    createdAt: dbCustomer.createdAt.toISOString(),
  };
};

export const registerOrUpdateCustomer = async (data: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatarUrl?: string;
}): Promise<CustomerAccount> => {
  const normalizedEmail = data.email.toLowerCase();
  const now = new Date();
  const joinDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const saved = await prisma.customer.upsert({
    where: { email: normalizedEmail },
    update: {
      name: data.name || undefined,
      phone: data.phone !== undefined ? data.phone : undefined,
      password: data.password !== undefined ? data.password : undefined,
      avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : undefined,
    },
    create: {
      name: data.name,
      email: normalizedEmail,
      phone: data.phone || null,
      password: data.password || null,
      avatarUrl: data.avatarUrl || null,
      role: 'Customer',
      status: 'Active',
      joinDate,
      bookingCount: 0,
    },
  });

  return {
    id: saved.id,
    name: saved.name,
    email: saved.email.toLowerCase(),
    phone: saved.phone || '',
    password: saved.password || '',
    avatarUrl: (saved as any).avatarUrl || '',
    role: 'Customer',
    status: (saved.status === 'Suspended' ? 'Suspended' : 'Active') as 'Active' | 'Suspended',
    joinDate: saved.joinDate || joinDate,
    bookingCount: saved.bookingCount || 0,
    createdAt: saved.createdAt.toISOString(),
  };
};

export const deleteCustomer = async (id: string): Promise<boolean> => {
  try {
    await prisma.customer.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
};

export const updateCustomer = async (
  id: string,
  data: Partial<Pick<CustomerAccount, 'name' | 'email' | 'phone' | 'status' | 'avatarUrl'>>
): Promise<CustomerAccount | null> => {
  const existing = await findCustomerById(id);
  if (!existing) {
    return null;
  }

  if (data.email && data.email.toLowerCase() !== existing.email.toLowerCase()) {
    const dupe = await findCustomerByEmail(data.email);
    if (dupe && dupe.id !== id) {
      throw new Error('EMAIL_TAKEN');
    }
  }

  try {
    const dbUpdated = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        email: data.email ? data.email.toLowerCase() : undefined,
        phone: data.phone !== undefined ? data.phone : undefined,
        status: data.status ? data.status : undefined,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : undefined,
      },
    });

    return {
      id: dbUpdated.id,
      name: dbUpdated.name,
      email: dbUpdated.email.toLowerCase(),
      phone: dbUpdated.phone || '',
      password: dbUpdated.password || '',
      avatarUrl: (dbUpdated as any).avatarUrl || '',
      role: 'Customer',
      status: (dbUpdated.status === 'Suspended' ? 'Suspended' : 'Active') as 'Active' | 'Suspended',
      joinDate: dbUpdated.joinDate || existing.joinDate,
      bookingCount: dbUpdated.bookingCount || 0,
      createdAt: dbUpdated.createdAt.toISOString(),
    };
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw new Error('EMAIL_TAKEN');
    }
    throw err;
  }
};

export const verifyCustomerCredentials = async (
  emailOrUsername: string,
  password?: string
): Promise<CustomerAccount | null> => {
  const q = emailOrUsername.toLowerCase();
  const dbCustomer = await prisma.customer.findFirst({
    where: {
      OR: [
        { email: q },
        { name: q },
      ],
    },
  });

  if (!dbCustomer) return null;

  if (password && dbCustomer.password && dbCustomer.password !== password) {
    return null;
  }

  return {
    id: dbCustomer.id,
    name: dbCustomer.name,
    email: dbCustomer.email.toLowerCase(),
    phone: dbCustomer.phone || '',
    password: dbCustomer.password || '',
    avatarUrl: (dbCustomer as any).avatarUrl || '',
    role: 'Customer',
    status: (dbCustomer.status === 'Suspended' ? 'Suspended' : 'Active') as 'Active' | 'Suspended',
    joinDate: dbCustomer.joinDate || new Date(dbCustomer.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    bookingCount: dbCustomer.bookingCount || 0,
    createdAt: dbCustomer.createdAt.toISOString(),
  };
};
