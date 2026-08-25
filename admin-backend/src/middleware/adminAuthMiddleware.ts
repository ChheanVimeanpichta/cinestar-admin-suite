import { NextFunction, Request, Response } from 'express';
import { verifyAdminToken } from '../utils/jwt.js';

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing authorization token' });
    return;
  }

  try {
    const payload = verifyAdminToken(header.slice(7)) as {
      sub?: string;
      role?: string;
      email?: string;
    };
    if (!payload.sub || (payload.role !== 'admin' && payload.role !== 'staff')) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    req.admin = {
      id: payload.sub,
      email: payload.email ?? '',
      role: (payload.role as 'admin' | 'staff') || 'staff',
    };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
