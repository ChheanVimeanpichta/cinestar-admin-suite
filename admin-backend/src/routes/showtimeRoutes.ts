import { Router } from 'express';
import { createShowtime, listShowtimes, getStats } from '../controllers/showtimeController.js';

const router = Router();
router.get('/stats', getStats);
router.get('/', listShowtimes);
router.post('/', createShowtime);

export default router;
