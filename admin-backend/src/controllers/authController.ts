import { NextFunction, Request, Response } from 'express';
import { loginSchema, registerSchema } from '../schemas/index.js';
import {
  createAdmin,
  findAdminById,
  verifyAdminCredentials,
} from '../services/authService.js';
import { verifyCustomerCredentials } from '../services/customerService.js';
import { signAdminToken } from '../utils/jwt.js';
import { recordSecurityEvent } from '../services/securityService.js';

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Invalid email or password format';
      res.status(400).json({ message });
      return;
    }

    const { email, password } = parsed.data;
    let admin = await verifyAdminCredentials(email, password);

    if (!admin) {
      // Check if user has an account in the customer/staff table
      const customer = await verifyCustomerCredentials(email, password);
      if (customer) {
        const userRole = String(customer.role || 'Customer');
        if (userRole !== 'Admin' && userRole !== 'Staff') {
          recordSecurityEvent({
            category: 'security',
            tone: 'alert',
            message: `Access denied: Customer "${customer.email}" attempted to log in to Admin Dashboard`,
            highlight: 'Access denied',
            user: customer.name,
          });
          res.status(403).json({
            message: 'Access denied. Only Admin and Staff accounts have permission to access the Admin Dashboard.',
          });
          return;
        }

        // Staff or Admin promoted user
        admin = {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          role: userRole.toLowerCase() === 'admin' ? 'admin' : 'staff',
          avatarUrl: customer.avatarUrl,
          createdAt: customer.createdAt,
        };
      }
    }

    if (!admin) {
      recordSecurityEvent({
        category: 'security',
        tone: 'alert',
        message: `Admin portal authentication failed for "${email}"`,
        highlight: 'authentication failed',
        user: email,
      });
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    recordSecurityEvent({
      category: 'auth',
      tone: 'neutral',
      message: `${admin.role === 'admin' ? 'Admin' : 'Staff'} session initialized for ${admin.name} (${admin.email})`,
      highlight: 'session initialized',
      user: admin.name,
    });

    const token = signAdminToken({ sub: admin.id, role: admin.role, email: admin.email });
    res.json({ token, admin });
  } catch (err) {
    next(err);
  }
};

export const registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Invalid registration data';
      res.status(400).json({ message });
      return;
    }

    const { email, password, name, avatarUrl } = parsed.data;
    try {
      const admin = await createAdmin(email, password, name, avatarUrl);
      const token = signAdminToken({ sub: admin.id, role: admin.role, email: admin.email });
      res.status(201).json({ token, admin });
    } catch (err) {
      if (err instanceof Error && err.message === 'EMAIL_TAKEN') {
        res.status(409).json({ message: 'An account with this email already exists' });
        return;
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

export const getCurrentAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.admin?.id;
    if (!adminId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const admin = await findAdminById(adminId);
    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }
    const { password: _password, ...sessionAccount } = admin;
    res.json(sessionAccount);
  } catch (err) {
    next(err);
  }
};
