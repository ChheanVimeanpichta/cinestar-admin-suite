import { Router } from 'express';
import {
  bookScreening,
  getSeats,
  listScreenings,
  createScreeningHandler,
  syncScreeningsHandler,
  deleteScreeningHandler,
} from '../controllers/screeningController.js';

const router = Router();
router.get('/', listScreenings);
router.post('/', createScreeningHandler);
router.post('/sync', syncScreeningsHandler);
router.delete('/:id', deleteScreeningHandler);
router.get('/:id/seats', getSeats);
router.post('/:id/book', bookScreening);

export default router;
