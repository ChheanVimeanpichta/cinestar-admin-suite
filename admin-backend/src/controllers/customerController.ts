import { Request, Response } from 'express';
import {
  getAllCustomers,
  registerOrUpdateCustomer,
  findCustomerById,
  findCustomerByEmail,
  deleteCustomer,
  reactivateCustomer,
  updateCustomer,
  verifyCustomerCredentials,
} from '../services/customerService.js';
import { verifyAdminCredentials, findAdminByEmail } from '../services/authService.js';
import { recordSecurityEvent } from '../services/securityService.js';

export const listCustomers = async (_req: Request, res: Response) => {
  const customers = await getAllCustomers();
  res.json(customers);
};

export const loginCustomer = async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ message: 'Email/username and password are required' });
    return;
  }
  let customer = await verifyCustomerCredentials(String(email), String(password));
  if (!customer) {
    const admin = await verifyAdminCredentials(String(email), String(password));
    if (admin) {
      customer = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: '',
        role: admin.role === 'admin' ? 'Admin' : 'Staff',
        status: 'Active',
        avatarUrl: admin.avatarUrl,
        bookingCount: 0,
        createdAt: admin.createdAt,
      } as any;
    }
  }

  if (!customer) {
    recordSecurityEvent({
      category: 'security',
      tone: 'warning',
      message: `Failed customer login attempt for user "${email}" — invalid credentials`,
      highlight: 'invalid credentials',
      user: String(email),
    });
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  if (customer.status === 'Suspended') {
    recordSecurityEvent({
      category: 'security',
      tone: 'alert',
      message: `Access blocked: Suspended customer account "${email}" attempted login`,
      highlight: 'Access blocked',
      user: customer.name || String(email),
    });
    res.status(403).json({
      success: false,
      message: 'Your account has been disabled by an administrator. Please contact support.',
    });
    return;
  }

  recordSecurityEvent({
    category: 'auth',
    tone: 'neutral',
    message: `Customer ${customer.name} (${customer.email}) authenticated successfully`,
    highlight: 'authenticated successfully',
    user: customer.name,
  });

  res.json({
    success: true,
    message: 'Login successful',
    customer,
  });
};

export const registerCustomer = async (req: Request, res: Response) => {
  const { name, email, password, phone, avatarUrl } = req.body ?? {};
  if (!email || !name) {
    res.status(400).json({ message: 'Name and email are required' });
    return;
  }

  try {
    const customer = await registerOrUpdateCustomer({
      name: String(name),
      email: String(email),
      password: password ? String(password) : undefined,
      phone: phone ? String(phone) : undefined,
      avatarUrl: avatarUrl ? String(avatarUrl) : undefined,
    });

    recordSecurityEvent({
      category: 'auth',
      tone: 'neutral',
      message: `New customer registration: ${customer.name} (${customer.email}) joined CineStar`,
      highlight: 'New customer registration',
      user: customer.name,
    });

    res.status(201).json({
      success: true,
      message: 'Customer account registered successfully',
      customer,
    });
  } catch (err: any) {
    if (err?.message === 'ACCOUNT_DISABLED') {
      res.status(403).json({
        message: 'This account has been disabled by an administrator. Please contact support.',
      });
      return;
    }
    res.status(500).json({ message: 'Failed to register customer' });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  const customer = await findCustomerById(String(req.params.id));
  if (!customer) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  res.json(customer);
};

export const getCustomerStatus = async (req: Request, res: Response) => {
  const email = String(req.params.email ?? req.query.email ?? '').toLowerCase();
  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }
  const customer = await findCustomerByEmail(email);
  if (!customer) {
    const admin = await findAdminByEmail(email);
    if (admin) {
      res.json({
        exists: true,
        status: 'Active',
        isSuspended: false,
        role: admin.role === 'admin' ? 'Admin' : 'Staff',
      });
      return;
    }
    res.json({ exists: false, status: 'NotFound', isSuspended: false, role: 'Customer' });
    return;
  }
  res.json({
    exists: true,
    status: customer.status,
    isSuspended: customer.status === 'Suspended',
    role: customer.role || 'Customer',
  });
};

export const updateCustomerById = async (req: Request, res: Response) => {
  const updated = await updateCustomer(String(req.params.id), req.body ?? {});
  if (!updated) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  res.json(updated);
};

export const deleteCustomerById = async (req: Request, res: Response) => {
  const deleted = await deleteCustomer(String(req.params.id));
  if (!deleted) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  recordSecurityEvent({
    category: 'security',
    tone: 'alert',
    message: `Customer account suspended by administrator: ID ${req.params.id}`,
    highlight: 'account suspended',
  });
  res.json({ success: true, message: 'Customer account disabled successfully' });
};

export const reactivateCustomerById = async (req: Request, res: Response) => {
  const reactivated = await reactivateCustomer(String(req.params.id));
  if (!reactivated) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  recordSecurityEvent({
    category: 'security',
    tone: 'neutral',
    message: `Customer account reactivated by administrator: ID ${req.params.id}`,
    highlight: 'account reactivated',
  });
  res.json({ success: true, message: 'Customer account reactivated successfully' });
};

export const logoutCustomer = async (req: Request, res: Response) => {
  const { email, name } = req.body ?? {};
  if (email || name) {
    recordSecurityEvent({
      category: 'auth',
      tone: 'neutral',
      message: `Customer session terminated for ${name || 'User'} (${email || 'web'})`,
      highlight: 'session terminated',
      user: name || email,
    });
  }
  res.json({ success: true, message: 'Customer logged out successfully' });
};
