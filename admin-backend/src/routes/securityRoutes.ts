import { Router } from 'express';
import { getSecurityStream } from '../controllers/securityController.js';

const router = Router();
router.get('/stream', getSecurityStream);

export default router;
