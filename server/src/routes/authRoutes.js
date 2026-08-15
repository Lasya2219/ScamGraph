import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/me', requireAuth, authController.getMe);

export default router;
