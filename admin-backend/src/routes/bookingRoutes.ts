import { Router } from 'express';
import { getBookingDetails, getBookingLedger, getBookingLogStats, getMyBookingList, listBookings } from '../controllers/bookingController.js';

const router = Router();
router.get('/me', getMyBookingList);
router.get('/log-stats', getBookingLogStats);
router.get('/ledger', getBookingLedger);
router.get('/:id', getBookingDetails);
router.get('/', listBookings);

export default router;
