// admin-backend/src/routes/slideRoutes.ts
import { Router } from 'express';
import {
  listSlides,
  getSlide,
  createSlide,
  updateSlide,
  deleteSlide,
  slideStream,
} from '../controllers/slideController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = Router();

// Public read endpoints (used by movie-ticket-booking frontend & admin portal)
router.get('/stream', slideStream);
router.get('/', listSlides);
router.get('/:id', getSlide);

// Admin-protected mutations (create, update, delete)
router.post('/', adminAuthMiddleware, createSlide);
router.put('/:id', adminAuthMiddleware, updateSlide);
router.delete('/:id', adminAuthMiddleware, deleteSlide);

export default router;
