import { Router } from 'express';
import {
  createMovie,
  getMovie,
  listMovieScreenings,
  listMovies,
  listNowShowing,
} from '../controllers/movieController.js';

const router = Router();
router.get('/now-showing', listNowShowing);
router.get('/:movieId/screenings', listMovieScreenings);
router.get('/:id', getMovie);
router.get('/', listMovies);
router.post('/', createMovie);

export default router;
