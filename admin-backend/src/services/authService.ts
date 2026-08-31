import { prisma } from '../config/db.js';

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  password: string;
  avatarUrl?: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export interface AdminSessionAccount {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

const DEFAULT_ADMIN_EMAIL = 'admin@gmail.com';

export const toSessionAccount = ({ password: _password, ...account }: AdminAccount): AdminSessionAccount => account;

export const getAllAdmins = async (): Promise<AdminAccount[]> => {
  const dbAdmins = await prisma.admin.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return dbAdmins.map((a) => ({
    id: a.id,
    email: a.email.toLowerCase(),
    name: a.name,
    password: a.password,
    avatarUrl: (a as any).avatarUrl || '',
    role: (a.role === 'admin' ? 'admin' : 'staff') as 'admin' | 'staff',
    createdAt: a.createdAt.toISOString(),
  }));
};

export const findAdminByEmail = async (email: string): Promise<AdminAccount | undefined> => {
  const normalizedEmail = email.toLowerCase();
  const dbAdmin = await prisma.admin.findUnique({
    where: { email: normalizedEmail },
  });
  if (!dbAdmin) return undefined;
  return {
    id: dbAdmin.id,
    email: dbAdmin.email.toLowerCase(),
    name: dbAdmin.name,
    password: dbAdmin.password,
    avatarUrl: (dbAdmin as any).avatarUrl || '',
    role: (dbAdmin.role === 'admin' ? 'admin' : 'staff') as 'admin' | 'staff',
    createdAt: dbAdmin.createdAt.toISOString(),
  };
};

export const findAdminById = async (id: string): Promise<AdminAccount | undefined> => {
  const dbAdmin = await prisma.admin.findUnique({
    where: { id },
  });
  if (!dbAdmin) return undefined;
  return {
    id: dbAdmin.id,
    email: dbAdmin.email.toLowerCase(),
    name: dbAdmin.name,
    password: dbAdmin.password,
    avatarUrl: (dbAdmin as any).avatarUrl || '',
    role: (dbAdmin.role === 'admin' ? 'admin' : 'staff') as 'admin' | 'staff',
    createdAt: dbAdmin.createdAt.toISOString(),
  };
};

export const verifyAdminCredentials = async (
  email: string,
  password: string
): Promise<AdminSessionAccount | null> => {
  const admin = await findAdminByEmail(email);
  if (!admin || admin.password !== password) {
    return null;
  }
  return toSessionAccount(admin);
};

export const createAdmin = async (
  email: string,
  password: string,
  name: string,
  avatarUrl?: string
): Promise<AdminSessionAccount> => {
  const normalizedEmail = email.toLowerCase();
  const isDefaultAdmin = normalizedEmail === DEFAULT_ADMIN_EMAIL.toLowerCase();
  const role: 'admin' | 'staff' = isDefaultAdmin ? 'admin' : 'staff';

  try {
    const created = await prisma.admin.create({
      data: {
        email: normalizedEmail,
        name,
        password,
        avatarUrl: avatarUrl || null,
        role,
      } as any,
    });

    const newAdmin: AdminAccount = {
      id: created.id,
      email: created.email.toLowerCase(),
      name: created.name,
      password: created.password,
      avatarUrl: (created as any).avatarUrl || avatarUrl || '',
      role: (created.role === 'admin' ? 'admin' : 'staff') as 'admin' | 'staff',
      createdAt: created.createdAt.toISOString(),
    };

    return toSessionAccount(newAdmin);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw new Error('EMAIL_TAKEN');
    }
    throw err;
  }
};

export const updateAdmin = async (
  id: string,
  data: Partial<Pick<AdminAccount, 'name' | 'email' | 'password' | 'avatarUrl'>>
): Promise<AdminSessionAccount | null> => {
  const existing = await findAdminById(id);
  if (!existing) {
    return null;
  }

  if (data.email && data.email.toLowerCase() !== existing.email.toLowerCase()) {
    const dupe = await findAdminByEmail(data.email);
    if (dupe && dupe.id !== id) {
      throw new Error('EMAIL_TAKEN');
    }
  }

  try {
    const dbUpdated = await prisma.admin.update({
      where: { id },
      data: {
        email: data.email ? data.email.toLowerCase() : undefined,
        name: data.name ?? undefined,
        password: data.password ?? undefined,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : undefined,
      } as any,
    });

    const updatedAdmin: AdminAccount = {
      id: dbUpdated.id,
      email: dbUpdated.email.toLowerCase(),
      name: dbUpdated.name,
      password: dbUpdated.password,
      avatarUrl: (dbUpdated as any).avatarUrl !== undefined && (dbUpdated as any).avatarUrl !== null ? (dbUpdated as any).avatarUrl : (existing.avatarUrl || ''),
      role: (dbUpdated.role === 'admin' ? 'admin' : 'staff') as 'admin' | 'staff',
      createdAt: dbUpdated.createdAt.toISOString(),
    };

    return toSessionAccount(updatedAdmin);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw new Error('EMAIL_TAKEN');
    }
    throw err;
  }
};

export const deleteAdmin = async (id: string): Promise<boolean> => {
  const target = await findAdminById(id);
  if (!target) {
    return false;
  }
  if (target.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
    return false;
  }

  try {
    await prisma.admin.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
};

export const resetAdminsForTest = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') return;
  try {
    await prisma.admin.deleteMany({});
    await prisma.admin.create({
      data: {
        email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
        name: 'Admin',
        password: 'cinestar123',
        role: 'admin',
      },
    });
  } catch {
    // Ignore test cleanup error
  }
};
