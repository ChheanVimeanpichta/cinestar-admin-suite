import { Router } from 'express';
import {
  listOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
  offerStream,
} from '../controllers/offerController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = Router();

// Public read endpoints (for movie-ticket-booking frontend & admin portal)
router.get('/stream', offerStream);
router.get('/', listOffers);
router.get('/:id', getOffer);

// Admin-protected mutations (create, update, delete)
router.post('/', adminAuthMiddleware, createOffer);
router.put('/:id', adminAuthMiddleware, updateOffer);
router.delete('/:id', adminAuthMiddleware, deleteOffer);

export default router;
