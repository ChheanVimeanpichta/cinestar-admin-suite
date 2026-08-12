import { Request, Response } from 'express';
import {
  getBookingById,
  getBookings,
  getMyBookings,
} from '../services/mockDataService.js';

export const listBookings = async (_req: Request, res: Response) => {
  res.json(await getBookings());
};

export const getMyBookingList = async (_req: Request, res: Response) => {
  res.json(await getMyBookings());
};

export const getBookingDetails = async (req: Request, res: Response) => {
  const booking = await getBookingById(String(req.params.id));
  if (!booking) {
    res.status(404).json({ message: 'Booking not found' });
    return;
  }
  res.json(booking);
};
