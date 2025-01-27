import express from 'express';
import { PromptController } from '../controllers/promptController';
import { CustomerController } from '../controllers/customerController';
import { verifyRefreshTokenMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const promptController = new PromptController();
const customerController = new CustomerController();

router.post('/prompt/getPrompt', verifyRefreshTokenMiddleware, (req, res) => promptController.getPrompt(req, res));
router.post('/prompt/deletePromptByServicePromptResponse', verifyRefreshTokenMiddleware, (req, res) => promptController.deletePromptByServicePromptResponse(req, res)); 
router.get('/prompt/getCustomerPrompts', verifyRefreshTokenMiddleware, (req, res) => customerController.getCustomerPrompts(req, res));

export default router;