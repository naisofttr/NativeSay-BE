import { Customer } from '../models/customer';
import { CreateCustomerDto, CreatedCustomerResponse } from '../models/customer';
import { GoogleAuthService } from './googleAuthService';
import { AppDataSource } from '../config/database';

export class CustomerService {
    private customerRepository = AppDataSource.getRepository(Customer);
    private googleAuthService: GoogleAuthService;

    constructor() {
        this.googleAuthService = new GoogleAuthService();
    }

    async createCustomer(customerData: CreateCustomerDto): Promise<CreatedCustomerResponse> {
        try {
            // Google Token doğrulama
            const isValidToken = await this.googleAuthService.verifyGoogleToken(customerData.IdToken);
            if (!isValidToken) {
                return {
                    success: false,
                    errorMessage: 'Geçersiz Google Token'
                };
            }

            // Mevcut müşteriyi kontrol et
            let customer = await this.customerRepository.findOne({
                where: { email: customerData.Email }
            });

            if (customer) {
                // Müşteri varsa güncelle
                customer.name = customerData.Name;
                customer.profilePhotoUrl = customerData.ProfilePhotoUrl;
                customer.updatedAt = new Date();
            } else {
                // Yeni müşteri oluştur
                customer = this.customerRepository.create({
                    email: customerData.Email,
                    name: customerData.Name,
                    profilePhotoUrl: customerData.ProfilePhotoUrl,
                    // idToken: customerData.IdToken,
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
                errorMessage: `Müşteri oluşturulurken bir hata oluştu: ${errorMessage}`
            };
        }
    }

    async getCustomerByEmail(email: string): Promise<Customer | null> {
        return await this.customerRepository.findOne({
            where: { email }
        });
    }
} 