import { NextFunction, Request, Response } from 'express';
import { loginSchema, registerSchema } from '../schemas/index.js';
import {
  createAdmin,
  findAdminById,
  verifyAdminCredentials,
} from '../services/authService.js';
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
    const admin = await verifyAdminCredentials(email, password);
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
      message: `Admin session initialized for ${admin.name} (${admin.email})`,
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
