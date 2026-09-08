import { Router } from 'express';
import {
  getBookingDetails,
  getBookingLedger,
  getBookingLogStats,
  getMyBookingList,
  listBookings,
  createBookingHandler,
  getOccupiedSeatsHandler,
  getCustomerBookingsHandler,
} from '../controllers/bookingController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = Router();

// Customer ticket booking creation
router.post('/', createBookingHandler);

// Public seat occupancy check for real-time conflict prevention
router.get('/occupied-seats', getOccupiedSeatsHandler);

// Customer bookings for profile detail
router.get('/customer/:emailOrId', getCustomerBookingsHandler);

// Booking details (accessible for ticket view and validation)
router.get('/:id', getBookingDetails);

// Admin-protected booking log and stats
router.get('/me', getMyBookingList);
router.get('/log-stats', adminAuthMiddleware, getBookingLogStats);
router.get('/ledger', adminAuthMiddleware, getBookingLedger);
router.get('/', adminAuthMiddleware, listBookings);

export default router;
