import { Request, Response } from 'express';
import {
  getCurrentUser,
  getAdminUserRecordsPaginated,
  getGrowthMetricsData,
  getUserManagementStats,
  getUsers,
  updateUser,
} from '../services/mockDataService.js';
import { deleteAdmin, updateAdmin } from '../services/authService.js';
import { deleteCustomer, updateCustomer } from '../services/customerService.js';

export const listUsers = async (_req: Request, res: Response) => {
  res.json(await getUsers());
};

export const getAdminUsers = async (req: Request, res: Response) => {
  const role = String(req.query.role ?? 'All');
  const status = String(req.query.status ?? 'All');
  const search = String(req.query.search ?? '');
  const page = parseInt(String(req.query.page ?? '1'), 10) || 1;
  const result = await getAdminUserRecordsPaginated({ role, status, search, page });
  res.json(result);
};

export const getMe = async (_req: Request, res: Response) => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const user = await updateUser(String(req.params.id), req.body ?? {});
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
};

export const updateUserRecord = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { name, email, status, avatarUrl } = req.body ?? {};
  try {
    const updated = await updateAdmin(id, { name, email, avatarUrl });
    if (updated) {
      res.json(updated);
      return;
    }
    const updatedCust = await updateCustomer(id, { name, email, status, avatarUrl } as any);
    if (updatedCust) {
      res.json(updatedCust);
      return;
    }
    res.status(404).json({ message: 'User not found' });
  } catch (err) {
    if (err instanceof Error && err.message === 'EMAIL_TAKEN') {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const successAdmin = await deleteAdmin(id);
  if (successAdmin) {
    res.json({ success: true, message: 'User deleted successfully' });
    return;
  }
  const successCust = await deleteCustomer(id);
  if (successCust) {
    res.json({ success: true, message: 'Customer deleted successfully' });
    return;
  }
  res.status(404).json({ message: 'User not found' });
};

export const getUserStats = async (_req: Request, res: Response) => {
  res.json(await getUserManagementStats());
};

export const getGrowthMetrics = async (_req: Request, res: Response) => {
  res.json(await getGrowthMetricsData());
};
