import { Router } from 'express';
import {
  createMovie,
  getMovie,
  listMovieScreenings,
  listMovies,
  listNowShowing,
  updateMovie,
  deleteMovie,
  bulkDeleteMovies,
} from '../controllers/movieController.js';

import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = Router();
router.get('/now-showing', listNowShowing);
router.get('/:movieId/screenings', listMovieScreenings);
router.get('/:id', getMovie);
router.get('/', listMovies);

// Protected mutation routes (Admin only)
router.post('/', adminAuthMiddleware, createMovie);
router.put('/:id', adminAuthMiddleware, updateMovie);
router.delete('/:id', adminAuthMiddleware, deleteMovie);
router.post('/bulk-delete', adminAuthMiddleware, bulkDeleteMovies);

export default router;
