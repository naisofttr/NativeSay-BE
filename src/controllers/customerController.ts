import { Request, Response } from 'express';
import { UpdateCustomerService } from '../services/CustomerServices/Commands/updateCustomerService';
import { UpdateCustomerDto } from '../dtos/Customer/updateCustomerDto';
import { extractCustomerIdFromToken } from '../utils/jwtUtils';
export class CustomerController {
    private updateCustomerService: UpdateCustomerService;

    constructor() {
        this.updateCustomerService = new UpdateCustomerService();
    }

    async updateCustomer(req: Request, res: Response) {
        try {
            const customerId = extractCustomerIdFromToken(req);
            
            const updateData: UpdateCustomerDto = req.body;

            // Validate input
            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz token.'
                });
            }

            // Update customer using service
            const updatedCustomer = await this.updateCustomerService.updateCustomer({
                id: customerId,
                ...req.body,
                clientDate: req.body.clientDate || new Date()
            });

            return res.status(200).json({
                success: true,
                data: updatedCustomer,
                message: 'Müşteri başarıyla güncellendi'
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return res.status(500).json({
                success: false,
                message: `Müşteri güncellenirken bir hata oluştu: ${errorMessage}`
            });
        }
    }
}
