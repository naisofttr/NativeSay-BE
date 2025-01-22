import { Request, Response } from 'express';
import { UpdateCustomerService } from '../services/CustomerServices/Commands/updateCustomerService';
import { UpdateCustomerDto } from '../dtos/Customer/updateCustomerDto';
import { AppDataSource } from '../config/database';
import { Customer } from '../models/customer';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class CustomerController {
    private updateCustomerService: UpdateCustomerService;
    private customerRepository = AppDataSource.getRepository(Customer);

    constructor() {
        this.updateCustomerService = new UpdateCustomerService();
    }

    async updateCustomer(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new Error('Authorization header geçersiz veya eksik');
            }

            const token = authHeader.split(' ')[1];
            const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
            const jwtDecode = jwt.verify(token, secretKey) as JwtPayload;
            const customerId = jwtDecode.id;
            
            const updateData: UpdateCustomerDto = req.body;

            // Validate input
            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz token.'
                });
            }

            // Find customer
            const customer = await this.customerRepository.findOne({
                where: { id: customerId }
            });

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Müşteri bulunamadı'
                });
            }

            // Update customer
            const updatedCustomer = await this.updateCustomerService.updateCustomer(customer, {
                ...updateData,
                updatedAt: updateData.clientDate ? new Date(updateData.clientDate) : new Date()
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
