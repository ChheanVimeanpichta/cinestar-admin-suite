import { Request, Response } from 'express';

export const getDashboardSummary = (_req: Request, res: Response) => {
  res.json({
    revenue: 0,
    activeBookings: 0,
    occupancy: 0,
    topMovies: [],
    recentBookings: [],
  });
};
