import { Router } from 'express';
import { listTheaters } from '../controllers/theaterController.js';

const router = Router();
router.get('/', listTheaters);

export default router;
