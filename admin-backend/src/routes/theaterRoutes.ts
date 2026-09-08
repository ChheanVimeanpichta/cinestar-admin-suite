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
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = Router();
router.get('/stats', getStats);
router.get('/venues', listVenues);
router.get('/venues/:venueId/halls', listVenueHalls);
router.get('/', listTheaters);

// Protected mutation routes (Admin & Staff authorized)
router.post('/venues', adminAuthMiddleware, createVenueHandler);
router.put('/venues/:id', adminAuthMiddleware, updateVenueHandler);
router.delete('/venues/:id', adminAuthMiddleware, deleteVenueHandler);

router.post('/venues/:venueId/halls', adminAuthMiddleware, createHallHandler);
router.put('/halls/:hallId', adminAuthMiddleware, updateHallHandler);
router.delete('/halls/:hallId', adminAuthMiddleware, deleteHallHandler);

export default router;
