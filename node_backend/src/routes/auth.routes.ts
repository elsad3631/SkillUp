import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.post('/verify_token', authController.verifyToken);

// Protected routes (require authentication)
router.put('/update-email', authenticateJWT, authController.updateEmail);
router.put('/update-password', authenticateJWT, authController.updatePassword);

export default router; 