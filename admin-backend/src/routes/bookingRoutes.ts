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

const router = Router();

// Customer ticket booking creation
router.post('/', createBookingHandler);

// Public seat occupancy check for real-time conflict prevention
router.get('/occupied-seats', getOccupiedSeatsHandler);

// Customer bookings for profile detail
router.get('/customer/:emailOrId', getCustomerBookingsHandler);

// Admin booking log and stats (MUST be defined before /:id)
router.get('/me', getMyBookingList);
router.get('/log-stats', getBookingLogStats);
router.get('/ledger', getBookingLedger);
router.get('/', listBookings);

// Booking details (accessible for ticket view and validation)
router.get('/:id', getBookingDetails);

export default router;
