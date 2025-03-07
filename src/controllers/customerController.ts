import { Request, Response } from 'express';
import { UpdateCustomerService } from '../services/CustomerServices/Commands/updateCustomerService';
import { DeleteCustomerService } from '../services/CustomerServices/Commands/deleteCustomerService';
import { extractCustomerIdFromToken } from '../utils/jwtUtils';
import { GetCustomerByIdQuery } from '../services/CustomerServices/Queries/getCustomerByIdQuery';

export class CustomerController {
    private updateCustomerService: UpdateCustomerService;
    private deleteCustomerService: DeleteCustomerService;
    private getCustomerByIdQuery: GetCustomerByIdQuery;

    constructor() {
        this.updateCustomerService = new UpdateCustomerService();
        this.deleteCustomerService = new DeleteCustomerService();
        this.getCustomerByIdQuery = new GetCustomerByIdQuery();
    }

    async updateCustomer(req: Request, res: Response) {
        try {
            const customerId = extractCustomerIdFromToken(req);

            // Validate input
            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz token.'
                });
            }
            
            // Get customer by ID
            // const customerResponse = await this.getCustomerByIdQuery.execute(customerId);
            // if (!customerResponse.success) {
            //     return res.status(404).json({
            //         success: false,
            //         message: customerResponse.errorMessage || 'Müşteri bulunamadı.'
            //     });
            // }

            req.body.id = customerId;
            // Update customer using service
            const updatedCustomer = await this.updateCustomerService.execute({
                ...req.body
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

    async deleteCustomer(req: Request, res: Response) {
        try {
            const customerId = extractCustomerIdFromToken(req);
    
            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz token.'
                });
            }
    
            await this.deleteCustomerService.execute(customerId);
    
            return res.status(200).json({
                success: true,
                message: 'Müşteri başarıyla silindi'
            });
    
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return res.status(500).json({
                success: false,
                message: `Müşteri silinirken bir hata oluştu: ${errorMessage}`
            });
        }
    }
}
