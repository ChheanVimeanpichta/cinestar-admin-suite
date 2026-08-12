import { Request, Response } from 'express';
import { getScreenings, getShowtimeRows, getShowtimeStats } from '../services/mockDataService.js';

export const listShowtimes = async (req: Request, res: Response) => {
  const page = parseInt(String(req.query.page ?? '1'), 10) || 1;
  const data = await getShowtimeRows(page);
  res.json(data);
};

export const listAllShowtimes = async (_req: Request, res: Response) => {
  res.json(await getScreenings());
};

export const createShowtime = (_req: Request, res: Response) => {
  res.status(201).json({ message: 'Showtime created' });
};

export const getStats = async (_req: Request, res: Response) => {
  res.json(await getShowtimeStats());
};
