// Mock admin credential store — mirrors the mock-data pattern used across
// this backend. Swap in a real database (e.g. the Prisma Admin model) and
// password hashing when the persistence layer is wired up.

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin';
  createdAt: string;
}

export interface AdminSessionAccount {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt: string;
}

const DEFAULT_ADMIN_EMAIL = 'admin@cinestar.com';
const DEFAULT_ADMIN_PASSWORD = 'cinestar123';

const admins: AdminAccount[] = [
  {
    id: 'adm-1',
    email: DEFAULT_ADMIN_EMAIL,
    name: 'System Admin',
    password: DEFAULT_ADMIN_PASSWORD,
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export const toSessionAccount = ({ password: _password, ...account }: AdminAccount): AdminSessionAccount => account;

export const findAdminByEmail = (email: string): AdminAccount | undefined =>
  admins.find((a) => a.email.toLowerCase() === email.toLowerCase());

export const findAdminById = (id: string): AdminAccount | undefined =>
  admins.find((a) => a.id === id);

export const verifyAdminCredentials = (
  email: string,
  password: string
): AdminSessionAccount | null => {
  const admin = findAdminByEmail(email);
  if (!admin || admin.password !== password) {
    return null;
  }
  return toSessionAccount(admin);
};

export const createAdmin = (email: string, password: string, name: string): AdminSessionAccount => {
  const existing = findAdminByEmail(email);
  if (existing) {
    throw new Error('EMAIL_TAKEN');
  }
  const admin: AdminAccount = {
    id: `adm-${admins.length + 1}`,
    email: email.toLowerCase(),
    name,
    password,
    role: 'admin',
    createdAt: new Date().toISOString(),
  };
  admins.push(admin);
  return toSessionAccount(admin);
};
