import express from 'express';
import { PromptController } from '../controllers/promptController';
import { verifyRefreshTokenMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const promptController = new PromptController();

router.post('/prompt/getPrompt', verifyRefreshTokenMiddleware, (req, res) => promptController.getPrompt(req, res));
router.delete('/prompt/deletePromptById/:id', verifyRefreshTokenMiddleware, (req, res) => promptController.deletePromptById(req, res));

export default router;