import { Router } from 'express';
import { createMovie, listMovies } from '../controllers/movieController.js';

const router = Router();
router.get('/', listMovies);
router.post('/', createMovie);

export default router;
