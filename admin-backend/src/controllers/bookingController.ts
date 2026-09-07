import { Request, Response } from 'express';
import {
  getBookingLedgerFromDb,
  getBookingLogStatsFromDb,
  getBookingByIdFromDb,
  createBookingInDb,
} from '../services/bookingService.js';
import { getMyBookings } from '../services/mockDataService.js';

export const listBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await getBookingLedgerFromDb();
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to fetch bookings' });
  }
};

export const getMyBookingList = async (_req: Request, res: Response) => {
  res.json(await getMyBookings());
};

export const getBookingDetails = async (req: Request, res: Response) => {
  try {
    const booking = await getBookingByIdFromDb(String(req.params.id));
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }
    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to fetch booking details' });
  }
};

export const getBookingLogStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getBookingLogStatsFromDb();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to fetch booking stats' });
  }
};

export const getBookingLedger = async (_req: Request, res: Response) => {
  try {
    const ledger = await getBookingLedgerFromDb();
    res.json(ledger);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to fetch booking ledger' });
  }
};

export const createBookingHandler = async (req: Request, res: Response) => {
  try {
    const created = await createBookingInDb(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ message: err?.message || 'Failed to create booking' });
  }
};
