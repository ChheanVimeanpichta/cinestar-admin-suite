import { Router } from 'express';
import {
  getCurrentAdmin,
  loginAdmin,
  registerAdmin,
} from '../controllers/authController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = Router();
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.get('/me', adminAuthMiddleware, getCurrentAdmin);

export default router;