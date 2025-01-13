import { Router } from 'express';
import { PromptController } from '../controllers/promptController';

const router = Router();
const promptController = new PromptController();

// /api/prompt/getPrompt şeklinde erişim için
router.post('/prompt/getPrompt', promptController.getPrompt.bind(promptController));

export default router; 