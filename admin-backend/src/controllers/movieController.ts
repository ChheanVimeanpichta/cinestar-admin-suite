import { Request, Response } from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie as createMovieService,
  updateMovie as updateMovieService,
  deleteMovie as deleteMovieService,
  deleteManyMovies as deleteManyMoviesService,
} from '../services/movieService.js';
import { getScreeningsForMovie } from '../services/mockDataService.js';

export const listMovies = async (_req: Request, res: Response) => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to list movies' });
  }
};

export const listNowShowing = async (_req: Request, res: Response) => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to list now showing movies' });
  }
};

export const getMovie = async (req: Request, res: Response) => {
  try {
    const movie = await getMovieById(String(req.params.id));
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }
    res.json(movie);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to get movie' });
  }
};

export const listMovieScreenings = async (req: Request, res: Response) => {
  try {
    const screenings = await getScreeningsForMovie(String(req.params.movieId));
    res.json(screenings);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to get screenings' });
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data || !data.title) {
      res.status(400).json({ message: 'Movie title is required' });
      return;
    }
    const movie = await createMovieService(data);
    res.status(201).json(movie);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to create movie' });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const movie = await updateMovieService(id, req.body);
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }
    res.json(movie);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update movie' });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const success = await deleteMovieService(id);
    if (!success) {
      res.status(404).json({ success: false, message: 'Movie not found or failed to delete' });
      return;
    }
    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete movie' });
  }
};

export const bulkDeleteMovies = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ message: 'Array of movie IDs is required' });
      return;
    }
    const count = await deleteManyMoviesService(ids);
    res.json({ success: true, deletedCount: count });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to bulk delete movies' });
  }
};
