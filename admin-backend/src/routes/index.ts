import { Router } from 'express';
import authRoutes from './authRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import movieRoutes from './movieRoutes.js';
import screeningRoutes from './screeningRoutes.js';
import securityRoutes from './securityRoutes.js';
import showtimeRoutes from './showtimeRoutes.js';
import theaterRoutes from './theaterRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/movies', movieRoutes);
router.use('/theaters', theaterRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/screenings', screeningRoutes);
router.use('/bookings', bookingRoutes);
router.use('/security', securityRoutes);
router.use('/users', userRoutes);

export default router;
