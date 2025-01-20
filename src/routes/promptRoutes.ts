import express from 'express';
import { PromptController } from '../controllers/promptController';
import { verifyRefreshTokenMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const promptController = new PromptController();

router.post('/prompt/getPrompt', verifyRefreshTokenMiddleware, (req, res) => promptController.getPrompt(req, res));
router.post('/prompt/deletePromptByServicePromptResponse', verifyRefreshTokenMiddleware, (req, res) => promptController.deletePromptByServicePromptResponse(req, res));

export default router;