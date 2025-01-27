import { Request, Response } from 'express';
import { UpdateCustomerService } from '../services/CustomerServices/Commands/updateCustomerService';
import { UpdateCustomerDto } from '../dtos/Customer/updateCustomerDto';
import { extractCustomerIdFromToken } from '../utils/jwtUtils';
import { GetCustomerPromptsQuery } from '../services/Prompt/Queries/GetCustomerPromptsQuery';

export class CustomerController {
    private updateCustomerService: UpdateCustomerService;
    private getCustomerPromptsQuery: GetCustomerPromptsQuery;

    constructor() {
        this.updateCustomerService = new UpdateCustomerService();
        this.getCustomerPromptsQuery = new GetCustomerPromptsQuery();
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
            const updatedCustomer = await this.updateCustomerService.updateCustomer(
                customerId,
                {
                    ...updateData,
                    updatedAt: updateData.clientDate ? new Date(updateData.clientDate) : new Date()
                }
            );

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

    async getCustomerPrompts(req: Request, res: Response) {
        try {
            const customerId = extractCustomerIdFromToken(req);
            const prompts = await this.getCustomerPromptsQuery.execute(customerId);
            res.status(200).json(prompts);
        } catch (error) {
            console.error('Müşteri promptları getirme hatası:', error);
            res.status(500).json({ 
                error: 'Müşteri promptları getirilirken bir hata oluştu',
                details: error instanceof Error ? error.message : 'Bilinmeyen hata'
            });
        }
    }
}
