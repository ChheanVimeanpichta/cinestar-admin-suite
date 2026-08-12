import { Request, Response } from 'express';
import {
  createBooking,
  getScreenings,
  getSeatsForScreening,
} from '../services/mockDataService.js';

export const listScreenings = async (_req: Request, res: Response) => {
  res.json(await getScreenings());
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
