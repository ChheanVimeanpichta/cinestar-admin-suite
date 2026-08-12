import { Request, Response } from 'express';
import {
  getCurrentUser,
  getAdminUserRecords,
  getGrowthMetricsData,
  getUserManagementStats,
  getUsers,
  updateUser,
} from '../services/mockDataService.js';

export const listUsers = async (_req: Request, res: Response) => {
  res.json(await getUsers());
};

export const getAdminUsers = async (req: Request, res: Response) => {
  const role = String(req.query.role ?? 'All');
  const status = String(req.query.status ?? 'All');
  const search = String(req.query.search ?? '');
  const page = parseInt(String(req.query.page ?? '1'), 10) || 1;
  res.json(await getAdminUserRecords({ role, status, search, page }));
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

export const getUserStats = async (_req: Request, res: Response) => {
  res.json(await getUserManagementStats());
};

export const getGrowthMetrics = async (_req: Request, res: Response) => {
  res.json(await getGrowthMetricsData());
};
