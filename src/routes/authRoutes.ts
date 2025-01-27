import express from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();
const authController = new AuthController();

// Auth routes
router.post('/auth/login', (req, res) => authController.login(req, res));

export default router;