import { Request, Response } from 'express';
import { getSecurityStream as getSecurityStreamData } from '../services/mockDataService.js';

export const getSecurityStream = async (_req: Request, res: Response) => {
  res.json(await getSecurityStreamData());
};
