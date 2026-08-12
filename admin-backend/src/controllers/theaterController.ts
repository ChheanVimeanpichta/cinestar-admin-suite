import { Request, Response } from 'express';
import { getTheaters, getVenues, getHallsForVenue, getVenueStats } from '../services/mockDataService.js';

export const listTheaters = async (_req: Request, res: Response) => {
  res.json(await getTheaters());
};

export const listVenues = async (_req: Request, res: Response) => {
  res.json(await getVenues());
};

export const listVenueHalls = async (req: Request, res: Response) => {
  res.json(await getHallsForVenue(req.params.venueId as string));
};

export const getStats = async (_req: Request, res: Response) => {
  res.json(await getVenueStats());
};
