import { Router } from 'express';
import {
  getMe,
  getAdminUsers,
  getGrowthMetrics,
  getUserStats,
  updateUserProfile,
  updateUserRecord,
  deleteUserById,
} from '../controllers/userController.js';

const router = Router();
router.get('/me', getMe);
router.get('/stats', getUserStats);
router.get('/growth-metrics', getGrowthMetrics);
router.get('/', getAdminUsers);
router.put('/:id', updateUserRecord);
router.post('/:id', updateUserProfile);
router.delete('/:id', deleteUserById);

export default router;
