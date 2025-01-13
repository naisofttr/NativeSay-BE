import { Router } from 'express';
import { PromptController } from '../controllers/promptController';

const router = Router();
const promptController = new PromptController();

router.post('/prompt', promptController.getPrompt.bind(promptController));

export default router; 