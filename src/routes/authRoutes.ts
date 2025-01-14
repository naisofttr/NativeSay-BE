import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

router.post('/auth/refreshToken', authController.refreshToken.bind(authController));

export default router; 