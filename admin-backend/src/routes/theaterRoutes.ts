import { Router } from 'express';
import { listTheaters, listVenues, listVenueHalls, getStats } from '../controllers/theaterController.js';

const router = Router();
router.get('/stats', getStats);
router.get('/venues', listVenues);
router.get('/venues/:venueId/halls', listVenueHalls);
router.get('/', listTheaters);

export default router;
