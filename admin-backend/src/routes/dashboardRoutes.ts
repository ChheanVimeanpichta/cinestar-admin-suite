import { Router } from 'express';
import {
  getDashboardSummary,
  getLiveFeed,
  getStats,
  getTrendingMovies,
  getWeeklySales,
} from '../controllers/dashboardController.js';

const router = Router();
router.get('/stats', getStats);
router.get('/weekly-sales', getWeeklySales);
router.get('/trending-movies', getTrendingMovies);
router.get('/live-feed', getLiveFeed);
router.get('/summary', getDashboardSummary);

export default router;
