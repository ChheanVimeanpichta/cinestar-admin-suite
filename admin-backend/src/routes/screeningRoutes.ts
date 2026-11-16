import { Router } from 'express';
import {
  bookScreening,
  getSeats,
  listScreenings,
  createScreeningHandler,
  updateScreeningHandler,
  syncScreeningsHandler,
  deleteScreeningHandler,
} from '../controllers/screeningController.js';

const router = Router();
router.get('/', listScreenings);
router.post('/', createScreeningHandler);
router.put('/:id', updateScreeningHandler);
router.post('/sync', syncScreeningsHandler);
router.delete('/:id', deleteScreeningHandler);
router.get('/:id/seats', getSeats);
router.post('/:id/book', bookScreening);

export default router;
