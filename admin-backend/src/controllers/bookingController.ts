import { Request, Response } from 'express';

export const listBookings = (_req: Request, res: Response) => {
  res.json([]);
};

export const getBookingDetails = (_req: Request, res: Response) => {
  res.json({ message: 'Booking details placeholder' });
};
