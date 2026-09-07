import { Router } from 'express';
import {
  getBookingDetails,
  getBookingLedger,
  getBookingLogStats,
  getMyBookingList,
  listBookings,
  createBookingHandler,
} from '../controllers/bookingController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = Router();

// Customer ticket booking creation
router.post('/', createBookingHandler);

// Admin-protected booking log and stats
router.get('/me', getMyBookingList);
router.get('/log-stats', adminAuthMiddleware, getBookingLogStats);
router.get('/ledger', adminAuthMiddleware, getBookingLedger);
router.get('/:id', adminAuthMiddleware, getBookingDetails);
router.get('/', adminAuthMiddleware, listBookings);

export default router;
