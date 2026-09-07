import { Router } from 'express';
import {
  listTheaters,
  listVenues,
  createVenueHandler,
  updateVenueHandler,
  deleteVenueHandler,
  listVenueHalls,
  createHallHandler,
  updateHallHandler,
  deleteHallHandler,
  getStats,
} from '../controllers/theaterController.js';

const router = Router();
router.get('/stats', getStats);
router.get('/venues', listVenues);
router.post('/venues', createVenueHandler);
router.put('/venues/:id', updateVenueHandler);
router.delete('/venues/:id', deleteVenueHandler);

router.get('/venues/:venueId/halls', listVenueHalls);
router.post('/venues/:venueId/halls', createHallHandler);
router.put('/halls/:hallId', updateHallHandler);
router.delete('/halls/:hallId', deleteHallHandler);

router.get('/', listTheaters);

export default router;
