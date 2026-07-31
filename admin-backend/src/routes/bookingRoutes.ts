import { Router } from 'express';
import { getBookingDetails, listBookings } from '../controllers/bookingController.js';

const router = Router();
router.get('/', listBookings);
router.get('/:id', getBookingDetails);

export default router;
