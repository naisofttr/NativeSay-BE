import { CreatedCustomerResponse } from '../models/customer';
import { AppDataSource } from '../config/database';
import { AppleAuthService } from './appleAuthService';
import { AppleTokenRequest } from '../models/auth';
import { Customer } from '../models/customer';

export class LoginWithAppleService {
    private customerRepository = AppDataSource.getRepository(Customer);
    private appleAuthService: AppleAuthService;

    constructor() {
        this.appleAuthService = new AppleAuthService();
    }

    async loginWithApple(appleData: AppleTokenRequest): Promise<CreatedCustomerResponse> {
        try {
            const appleUser = await this.appleAuthService.verifyAppleToken(appleData);
            if (!appleUser) {
                return {
                    success: false,
                    errorMessage: 'Geçersiz Apple token'
                };
            }

            let customer = await this.customerRepository.findOne({
                where: { email: appleUser.email }
            });

            if (customer) {
                // Müşteri varsa bilgilerini güncelle
                if (appleUser.name) {
                    customer.name = `${appleUser.name.firstName} ${appleUser.name.lastName}`.trim();
                }
                customer.updatedAt = new Date();
            } else {
                // Yeni müşteri oluştur
                customer = this.customerRepository.create({
                    email: appleUser.email,
                    name: appleUser.name ? 
                        `${appleUser.name.firstName} ${appleUser.name.lastName}`.trim() : 
                        appleUser.email.split('@')[0],
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            const savedCustomer = await this.customerRepository.save(customer);

            return {
                success: true,
                data: savedCustomer
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return {
                success: false,
                errorMessage: `Apple ile müşteri oluşturulurken bir hata oluştu: ${errorMessage}`
            };
        }
    }
} 