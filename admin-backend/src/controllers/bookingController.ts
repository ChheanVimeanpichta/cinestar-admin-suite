import { Request, Response } from 'express';
import {
  getBookingLedgerFromDb,
  getBookingLogStatsFromDb,
  getBookingByIdFromDb,
  createBookingInDb,
  getOccupiedSeatsFromDb,
  getBookingsByCustomer,
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

export const getOccupiedSeatsHandler = async (req: Request, res: Response) => {
  try {
    const { movieTitle, screeningDate, screeningTime, screeningId } = req.query;
    const occupiedSeats = await getOccupiedSeatsFromDb({
      movieTitle: movieTitle ? String(movieTitle) : undefined,
      screeningDate: screeningDate ? String(screeningDate) : undefined,
      screeningTime: screeningTime ? String(screeningTime) : undefined,
      screeningId: screeningId ? String(screeningId) : undefined,
    });
    res.json({ occupiedSeats });
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to fetch occupied seats' });
  }
};

export const getCustomerBookingsHandler = async (req: Request, res: Response) => {
  try {
    const identifier = String(req.params.emailOrId);
    const bookings = await getBookingsByCustomer(identifier);
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to fetch customer bookings' });
  }
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
    if (err?.status === 409 || (err?.message && err.message.includes('SEAT_CONFLICT'))) {
      res.status(409).json({
        conflict: true,
        message: err.message || 'Selected seat(s) have already been booked. Please choose other seats.',
        conflictingSeats: err.conflictingSeats,
      });
      return;
    }
    res.status(400).json({ message: err?.message || 'Failed to create booking' });
  }
};
