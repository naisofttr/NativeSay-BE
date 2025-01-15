import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';

const router = Router();

// Controller'ı lazy initialization ile oluştur
const getController = (() => {
    let controller: CustomerController | null = null;
    return () => {
        if (!controller) {
            controller = new CustomerController();
        }
        return controller;
    };
})();

// /api/customer/createCustomer şeklinde erişim için
router.post('/customer/createCustomer', (req, res) => {
    try {
        return getController().createCustomer(req, res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
        });
    }
});

router.post('/customer/createWithApple', (req, res) => {
    try {
        return getController().createCustomerWithApple(req, res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
        });
    }
});

export default router; 