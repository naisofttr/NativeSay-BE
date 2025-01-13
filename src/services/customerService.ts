import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Customer, CreateCustomerDto, CreatedCustomerResponse } from '../models/customer';
import { GoogleAuthService } from './googleAuthService';

export class CustomerService {
    private customerRepository: Repository<Customer>;
    private googleAuthService: GoogleAuthService;

    constructor() {
        this.customerRepository = AppDataSource.getRepository(Customer);
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
            const existingCustomer = await this.getCustomerByEmail(customerData.Email);
            const currentDateTime = new Date();

            if (existingCustomer) {
                // Müşteri varsa ve bilgileri değişmişse güncelle
                if (existingCustomer.name !== customerData.Name || 
                    existingCustomer.profilePhotoUrl !== customerData.ProfilePhotoUrl) {
                    
                    existingCustomer.name = customerData.Name;
                    existingCustomer.profilePhotoUrl = customerData.ProfilePhotoUrl;
                    existingCustomer.updatedAt = currentDateTime;

                    const updatedCustomer = await this.customerRepository.save(existingCustomer);
                    return {
                        success: true,
                        data: updatedCustomer
                    };
                }
                
                return {
                    success: true,
                    data: existingCustomer
                };
            } else {
                // Yeni müşteri oluştur
                const newCustomer = new Customer({
                    email: customerData.Email,
                    name: customerData.Name,
                    profilePhotoUrl: customerData.ProfilePhotoUrl,
                    idToken: customerData.IdToken,
                });

                const createdCustomer = await this.customerRepository.save(newCustomer);
                return {
                    success: true,
                    data: createdCustomer
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return {
                success: false,
                errorMessage: `Müşteri oluşturulurken bir hata oluştu: ${errorMessage}`
            };
        }
    }

    private async getCustomerByEmail(email: string): Promise<Customer | null> {
        return await this.customerRepository.findOne({ where: { email } });
    }
} 