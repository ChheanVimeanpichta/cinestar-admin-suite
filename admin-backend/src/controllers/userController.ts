import { Request, Response } from 'express';
import {
  getCurrentUser,
  getUsers,
  updateUser,
} from '../services/mockDataService.js';

export const listUsers = async (_req: Request, res: Response) => {
  res.json(await getUsers());
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
