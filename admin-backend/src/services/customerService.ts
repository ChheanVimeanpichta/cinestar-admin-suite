import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  ? path.join(DATA_DIR, 'customers.test.json')
  : path.join(DATA_DIR, 'customers.json');

const INITIAL_CUSTOMERS: CustomerAccount[] = [];

function ensureDataFile(): CustomerAccount[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const content = raw.trim().replace(/^\uFEFF/, '');
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('Failed to read persistent customer data file:', err);
  }

  saveCustomersToDisk(INITIAL_CUSTOMERS);
  return INITIAL_CUSTOMERS;
}

function saveCustomersToDisk(data: CustomerAccount[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist customer data to disk:', err);
  }
}

let customers: CustomerAccount[] = ensureDataFile();

export const getAllCustomers = (): CustomerAccount[] => {
  customers = ensureDataFile();
  return customers;
};

export const findCustomerByEmail = (email: string): CustomerAccount | undefined => {
  customers = ensureDataFile();
  return customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
};

export const findCustomerById = (id: string): CustomerAccount | undefined => {
  customers = ensureDataFile();
  return customers.find((c) => c.id === id);
};

export const registerOrUpdateCustomer = (data: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatarUrl?: string;
}): CustomerAccount => {
  customers = ensureDataFile();
  const existingIndex = customers.findIndex(
    (c) => c.email.toLowerCase() === data.email.toLowerCase()
  );

  const now = new Date();
  const joinDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  if (existingIndex >= 0) {
    customers[existingIndex] = {
      ...customers[existingIndex],
      name: data.name || customers[existingIndex].name,
      phone: data.phone ?? customers[existingIndex].phone,
      avatarUrl: data.avatarUrl ?? customers[existingIndex].avatarUrl,
      password: data.password ?? customers[existingIndex].password,
    };
    saveCustomersToDisk(customers);
    return customers[existingIndex];
  }

  const newCustomer: CustomerAccount = {
    id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone || '',
    password: data.password || '',
    avatarUrl: data.avatarUrl || '',
    role: 'Customer',
    status: 'Active',
    joinDate,
    bookingCount: 0,
    createdAt: now.toISOString(),
  };

  customers.unshift(newCustomer);
  saveCustomersToDisk(customers);
  return newCustomer;
};

export const deleteCustomer = (id: string): boolean => {
  customers = ensureDataFile();
  const initialLen = customers.length;
  customers = customers.filter((c) => c.id !== id);
  if (customers.length !== initialLen) {
    saveCustomersToDisk(customers);
    return true;
  }
  return false;
};

export const updateCustomer = (
  id: string,
  data: Partial<Pick<CustomerAccount, 'name' | 'email' | 'phone' | 'status'>>
): CustomerAccount | null => {
  customers = ensureDataFile();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) {
    return null;
  }
  if (data.email && data.email.toLowerCase() !== customers[index].email.toLowerCase()) {
    const existing = findCustomerByEmail(data.email);
    if (existing && existing.id !== id) {
      throw new Error('EMAIL_TAKEN');
    }
    customers[index].email = data.email.toLowerCase();
  }
  if (data.name) customers[index].name = data.name;
  if (data.phone !== undefined) customers[index].phone = data.phone;
  if (data.status) customers[index].status = data.status;

  saveCustomersToDisk(customers);
  return customers[index];
};

export const verifyCustomerCredentials = (
  emailOrUsername: string,
  password?: string
): CustomerAccount | null => {
  customers = ensureDataFile();
  const q = emailOrUsername.toLowerCase();
  const customer = customers.find(
    (c) => c.email.toLowerCase() === q || c.name.toLowerCase() === q
  );
  if (!customer) return null;
  if (password && customer.password && customer.password !== password) {
    return null;
  }
  return customer;
};
