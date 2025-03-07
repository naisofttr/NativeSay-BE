import express from 'express';
import { CustomerController } from '../controllers/customerController';
import { verifyRefreshTokenMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const customerController = new CustomerController();

// Müşteri güncelleme endpoint'i
router.post('/customer/update', verifyRefreshTokenMiddleware, (req, res) => customerController.updateCustomer(req, res));

// Müşteri silme endpoint'i
router.delete('/customer/delete', verifyRefreshTokenMiddleware, (req, res) => customerController.deleteCustomer(req, res));

export default router;
