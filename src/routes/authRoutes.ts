import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

// /api/auth/login şeklinde erişim için
router.post('/auth/login', authController.login.bind(authController));

export default router; 