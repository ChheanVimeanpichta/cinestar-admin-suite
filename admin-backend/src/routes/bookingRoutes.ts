import { Router } from 'express';
import { getBookingDetails, getMyBookingList, listBookings } from '../controllers/bookingController.js';

const router = Router();
router.get('/me', getMyBookingList);
router.get('/:id', getBookingDetails);
router.get('/', listBookings);

export default router;
