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
import customerRoutes from './customerRoutes.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/dashboard', adminAuthMiddleware, dashboardRoutes);
router.use('/movies', adminAuthMiddleware, movieRoutes);
router.use('/theaters', adminAuthMiddleware, theaterRoutes);
router.use('/showtimes', adminAuthMiddleware, showtimeRoutes);
router.use('/screenings', adminAuthMiddleware, screeningRoutes);
router.use('/bookings', adminAuthMiddleware, bookingRoutes);
router.use('/security', adminAuthMiddleware, securityRoutes);
router.use('/users', adminAuthMiddleware, userRoutes);

export default router;
