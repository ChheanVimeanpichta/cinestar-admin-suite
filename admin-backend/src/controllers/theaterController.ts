import { Request, Response } from 'express';
import { getTheaters } from '../services/mockDataService.js';
import {
  getAllVenues,
  createVenueInDb,
  updateVenueInDb,
  deleteVenueInDb,
  getHallsByVenueId,
  createHallInDb,
  updateHallInDb,
  deleteHallInDb,
  getVenueStatsFromDb,
} from '../services/venueService.js';

export const listTheaters = async (_req: Request, res: Response) => {
  res.json(await getTheaters());
};

export const listVenues = async (_req: Request, res: Response) => {
  try {
    const venues = await getAllVenues();
    res.json(venues);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to fetch venues' });
  }
};

export const createVenueHandler = async (req: Request, res: Response) => {
  try {
    const venue = await createVenueInDb(req.body);
    res.status(201).json(venue);
  } catch (err: any) {
    res.status(400).json({ message: err?.message || 'Failed to create venue' });
  }
};

export const updateVenueHandler = async (req: Request, res: Response) => {
  try {
    const venue = await updateVenueInDb(String(req.params.id), req.body);
    res.json(venue);
  } catch (err: any) {
    res.status(400).json({ message: err?.message || 'Failed to update venue' });
  }
};

export const deleteVenueHandler = async (req: Request, res: Response) => {
  try {
    const success = await deleteVenueInDb(String(req.params.id));
    if (!success) {
      res.status(404).json({ message: 'Venue not found' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to delete venue' });
  }
};

export const listVenueHalls = async (req: Request, res: Response) => {
  try {
    const halls = await getHallsByVenueId(String(req.params.venueId));
    res.json(halls);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to fetch halls' });
  }
};

export const createHallHandler = async (req: Request, res: Response) => {
  try {
    const hall = await createHallInDb(String(req.params.venueId), req.body);
    res.status(201).json(hall);
  } catch (err: any) {
    res.status(400).json({ message: err?.message || 'Failed to create hall' });
  }
};

export const updateHallHandler = async (req: Request, res: Response) => {
  try {
    const hall = await updateHallInDb(String(req.params.hallId), req.body);
    res.json(hall);
  } catch (err: any) {
    res.status(400).json({ message: err?.message || 'Failed to update hall' });
  }
};

export const deleteHallHandler = async (req: Request, res: Response) => {
  try {
    const success = await deleteHallInDb(String(req.params.hallId));
    if (!success) {
      res.status(404).json({ message: 'Hall not found' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to delete hall' });
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getVenueStatsFromDb();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Failed to fetch venue stats' });
  }
};
