import { Router } from 'express';
import { getMe, listUsers, updateUserProfile } from '../controllers/userController.js';

const router = Router();
router.get('/me', getMe);
router.get('/', listUsers);
router.post('/:id', updateUserProfile);

export default router;
