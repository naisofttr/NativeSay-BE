import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { CreateCustomerDto } from '../models/customer';

export class CustomerController {
    private customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

    async createCustomer(req: Request, res: Response) {
        try {
            const customerData: CreateCustomerDto = req.body;
            
            if (!customerData.Email || !customerData.Name || !customerData.IdToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Email, Name ve IdToken zorunlu alanlardır'
                });
            }

            const newCustomer = await this.customerService.createCustomer(customerData);
            
            if (!newCustomer.success) {
                return res.status(400).json({
                    success: false,
                    message: newCustomer.errorMessage
                });
            }

            return res.status(201).json({
                success: true,
                data: newCustomer.data,
                message: 'Müşteri başarıyla oluşturuldu'
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            
            return res.status(500).json({
                success: false,
                message: 'Müşteri oluşturulurken bir hata oluştu',
                error: errorMessage
            });
        }
    }
} 