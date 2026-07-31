import { Request, Response } from 'express';

export const loginAdmin = (_req: Request, res: Response) => {
  res.json({ message: 'Admin login route placeholder' });
};
