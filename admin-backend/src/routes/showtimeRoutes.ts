import { Router } from 'express';
import { createShowtime, listShowtimes } from '../controllers/showtimeController.js';

const router = Router();
router.get('/', listShowtimes);
router.post('/', createShowtime);

export default router;
