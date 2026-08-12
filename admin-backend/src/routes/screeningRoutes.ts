import { Router } from 'express';
import {
  bookScreening,
  getSeats,
  listScreenings,
} from '../controllers/screeningController.js';

const router = Router();
router.get('/', listScreenings);
router.get('/:id/seats', getSeats);
router.post('/:id/book', bookScreening);

export default router;
