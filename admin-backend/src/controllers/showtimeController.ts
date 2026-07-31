import { Request, Response } from 'express';

export const listShowtimes = (_req: Request, res: Response) => {
  res.json([]);
};

export const createShowtime = (_req: Request, res: Response) => {
  res.status(201).json({ message: 'Showtime created' });
};
