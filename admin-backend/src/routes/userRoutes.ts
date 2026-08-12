import { Router } from 'express';
import { getMe, getAdminUsers, getGrowthMetrics, getUserStats, updateUserProfile } from '../controllers/userController.js';

const router = Router();
router.get('/me', getMe);
router.get('/stats', getUserStats);
router.get('/growth-metrics', getGrowthMetrics);
router.get('/', getAdminUsers);
router.post('/:id', updateUserProfile);

export default router;
