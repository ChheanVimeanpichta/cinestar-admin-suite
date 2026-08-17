import { Request, Response } from 'express';
import { loginSchema, registerSchema } from '../schemas/index.js';
import {
  createAdmin,
  findAdminById,
  verifyAdminCredentials,
} from '../services/authService.js';
import { signAdminToken } from '../utils/jwt.js';

export const loginAdmin = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid email or password format' });
    return;
  }

  const { email, password } = parsed.data;
  const admin = verifyAdminCredentials(email, password);
  if (!admin) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = signAdminToken({ sub: admin.id, role: admin.role, email: admin.email });
  res.json({ token, admin });
};

export const registerAdmin = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid registration data' });
    return;
  }

  const { email, password, name } = parsed.data;
  try {
    const admin = createAdmin(email, password, name);
    const token = signAdminToken({ sub: admin.id, role: admin.role, email: admin.email });
    res.status(201).json({ token, admin });
  } catch (err) {
    if (err instanceof Error && err.message === 'EMAIL_TAKEN') {
      res.status(409).json({ message: 'An account with this email already exists' });
      return;
    }
    throw err;
  }
};

export const getCurrentAdmin = async (req: Request, res: Response) => {
  const adminId = req.admin?.id;
  if (!adminId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  const admin = findAdminById(adminId);
  if (!admin) {
    res.status(404).json({ message: 'Admin not found' });
    return;
  }
  const { password: _password, ...sessionAccount } = admin;
  res.json(sessionAccount);
};
