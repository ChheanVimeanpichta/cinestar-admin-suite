import { Request, Response } from 'express';
import {
  createBooking,
  getScreenings,
  getSeatsForScreening,
  createScreeningService,
  deleteScreeningService,
} from '../services/mockDataService.js';

export const listScreenings = async (_req: Request, res: Response) => {
  res.json(await getScreenings());
};

export const createScreeningHandler = async (req: Request, res: Response) => {
  try {
    const created = await createScreeningService(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to create screening' });
  }
};

export const syncScreeningsHandler = async (req: Request, res: Response) => {
  try {
    const list = req.body;
    if (Array.isArray(list)) {
      const results = [];
      for (const item of list) {
        results.push(await createScreeningService(item));
      }
      res.json({ success: true, count: results.length, screenings: results });
      return;
    }
    res.status(400).json({ message: 'Expected an array of showtimes' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to sync screenings' });
  }
};

export const deleteScreeningHandler = async (req: Request, res: Response) => {
  try {
    const success = await deleteScreeningService(String(req.params.id));
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to delete screening' });
  }
};

export const getSeats = async (req: Request, res: Response) => {
  res.json(await getSeatsForScreening(String(req.params.id)));
};

export const bookScreening = async (req: Request, res: Response) => {
  const { seatIds, paymentMethod } = req.body ?? {};
  if (!Array.isArray(seatIds) || seatIds.length === 0) {
    res.status(400).json({ message: 'seatIds must be a non-empty array' });
    return;
  }
  const booking = await createBooking(String(req.params.id), seatIds, paymentMethod ?? 'ABA');
  res.status(201).json(booking);
};
