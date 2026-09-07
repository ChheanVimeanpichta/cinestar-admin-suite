import { Request, Response } from 'express';
import { getDynamicSecurityStream } from '../services/securityService.js';

export const getSecurityStream = async (_req: Request, res: Response) => {
  try {
    const stream = await getDynamicSecurityStream();
    res.json(stream);
  } catch (err: any) {
    console.error('[securityController] Error fetching security stream:', err);
    res.status(500).json({ message: 'Failed to fetch security stream' });
  }
};
