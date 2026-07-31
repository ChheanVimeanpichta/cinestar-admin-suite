import { Request, Response } from 'express';

export const listMovies = (_req: Request, res: Response) => {
  res.json([]);
};

export const createMovie = (_req: Request, res: Response) => {
  res.status(201).json({ message: 'Movie created' });
};
