import { Request, Response } from 'express';
import {
  getMovieById,
  getMovies,
  getNowShowing,
  getScreeningsForMovie,
} from '../services/mockDataService.js';

export const listMovies = async (_req: Request, res: Response) => {
  res.json(await getMovies());
};

export const listNowShowing = async (_req: Request, res: Response) => {
  res.json(await getNowShowing());
};

export const getMovie = async (req: Request, res: Response) => {
  const movie = await getMovieById(String(req.params.id));
  if (!movie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }
  res.json(movie);
};

export const listMovieScreenings = async (req: Request, res: Response) => {
  res.json(await getScreeningsForMovie(String(req.params.movieId)));
};

export const createMovie = (_req: Request, res: Response) => {
  res.status(201).json({ message: 'Movie created' });
};
