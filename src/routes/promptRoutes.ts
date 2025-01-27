import express from 'express';
import { PromptController } from '../controllers/promptController';
import { verifyRefreshTokenMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const promptController = new PromptController();

router.post('/prompt/getPrompt', verifyRefreshTokenMiddleware, (req, res) => promptController.getPrompt(req, res));
router.post('/prompt/deletePromptByServicePromptResponse', verifyRefreshTokenMiddleware, (req, res) => promptController.deletePromptByServicePromptResponse(req, res)); 
router.get('/prompt/getCustomerPrompts', verifyRefreshTokenMiddleware, (req, res) => promptController.getCustomerPrompts(req, res));
router.post('/prompt/updatePromptConfirmedCount', verifyRefreshTokenMiddleware, (req, res) => promptController.updatePromptConfirmedCount(req, res));

export default router;