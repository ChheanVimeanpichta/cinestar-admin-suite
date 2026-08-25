import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export interface AdminSessionAccount {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

const DEFAULT_ADMIN_EMAIL = 'admin@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'cinestar123';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findPackageRoot(startDir: string): string {
  let cur = startDir;
  while (cur && cur !== path.dirname(cur)) {
    if (fs.existsSync(path.join(cur, 'package.json'))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return path.resolve(process.cwd());
}

const PKG_ROOT = findPackageRoot(__dirname);
const DATA_DIR = path.join(PKG_ROOT, 'data');
const isTestEnv = process.env.NODE_ENV === 'test';
const DATA_FILE = isTestEnv
  ? path.join(DATA_DIR, 'admins.test.json')
  : path.join(DATA_DIR, 'admins.json');

function ensureDataFile(): AdminAccount[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const content = raw.trim().replace(/^\uFEFF/, '');
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let changed = false;
          const normalized = parsed.map((item: any) => {
            const expectedRole: 'admin' | 'staff' =
              item.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'staff';
            if (item.role !== expectedRole) {
              changed = true;
            }
            return {
              ...item,
              role: expectedRole,
            };
          });
          if (changed) {
            saveAdminsToDisk(normalized);
          }
          return normalized;
        }
      }
    }
  } catch (err) {
    console.error('Failed to read persistent admin data file, initializing defaults:', err);
  }

  const initialAdmins: AdminAccount[] = [
    {
      id: 'adm-1',
      email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
      name: 'Admin',
      password: DEFAULT_ADMIN_PASSWORD,
      role: 'admin',
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];
  saveAdminsToDisk(initialAdmins);
  return initialAdmins;
}

function saveAdminsToDisk(data: AdminAccount[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist admin data to disk:', err);
  }
}

let admins: AdminAccount[] = ensureDataFile();

export const resetAdminsForTest = (): void => {
  if (!isTestEnv) return;
  try {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
  } catch {
    // Ignore cleanup error
  }
  admins = ensureDataFile();
};

export const toSessionAccount = ({ password: _password, ...account }: AdminAccount): AdminSessionAccount => account;

export const getAllAdmins = (): AdminAccount[] => {
  admins = ensureDataFile();
  return admins;
};

export const findAdminByEmail = (email: string): AdminAccount | undefined => {
  admins = ensureDataFile();
  return admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
};

export const findAdminById = (id: string): AdminAccount | undefined => {
  admins = ensureDataFile();
  return admins.find((a) => a.id === id);
};

export const verifyAdminCredentials = (
  email: string,
  password: string
): AdminSessionAccount | null => {
  admins = ensureDataFile();
  const admin = findAdminByEmail(email);
  if (!admin || admin.password !== password) {
    return null;
  }
  return toSessionAccount(admin);
};

export const createAdmin = (email: string, password: string, name: string): AdminSessionAccount => {
  admins = ensureDataFile();
  const existing = findAdminByEmail(email);
  if (existing) {
    throw new Error('EMAIL_TAKEN');
  }
  const isDefaultAdmin = email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase();
  const admin: AdminAccount = {
    id: `adm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: email.toLowerCase(),
    name,
    password,
    role: isDefaultAdmin ? 'admin' : 'staff',
    createdAt: new Date().toISOString(),
  };
  admins.push(admin);
  saveAdminsToDisk(admins);
  return toSessionAccount(admin);
};

export const updateAdmin = (
  id: string,
  data: Partial<Pick<AdminAccount, 'name' | 'email' | 'password'>>
): AdminSessionAccount | null => {
  admins = ensureDataFile();
  const index = admins.findIndex((a) => a.id === id);
  if (index === -1) {
    return null;
  }
  if (data.email && data.email.toLowerCase() !== admins[index].email.toLowerCase()) {
    const existing = findAdminByEmail(data.email);
    if (existing && existing.id !== id) {
      throw new Error('EMAIL_TAKEN');
    }
    admins[index].email = data.email.toLowerCase();
  }
  if (data.name) {
    admins[index].name = data.name;
  }
  if (data.password) {
    admins[index].password = data.password;
  }
  saveAdminsToDisk(admins);
  return toSessionAccount(admins[index]);
};

export const deleteAdmin = (id: string): boolean => {
  admins = ensureDataFile();
  const target = admins.find((a) => a.id === id);
  // Protect default admin from deletion
  if (target && target.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
    return false;
  }
  const initialLen = admins.length;
  admins = admins.filter((a) => a.id !== id);
  if (admins.length !== initialLen) {
    saveAdminsToDisk(admins);
    return true;
  }
  return false;
};
