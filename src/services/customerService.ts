import { Customer, CreateCustomerDto, CreatedCustomerResponse } from '../models/customer';
import { GoogleAuthService } from './googleAuthService';
import { AppDataSource } from '../config/database';

export class CustomerService {
    private customerRepository = AppDataSource.getRepository(Customer);
    private googleAuthService: GoogleAuthService;

    constructor() {
        this.googleAuthService = new GoogleAuthService();
    }

    /**
     * Yeni müşteri oluşturur veya mevcut müşteriyi günceller
     * @param customerData Müşteri bilgilerini içeren DTO
     * @returns Oluşturulan/güncellenen müşteri bilgisi veya hata mesajı
     */
    async createCustomer(customerData: CreateCustomerDto): Promise<CreatedCustomerResponse> {
        try {
            // Google token'ı doğrula
            const isValidToken = await this.googleAuthService.verifyGoogleToken(customerData.IdToken);
            if (!isValidToken) {
                return {
                    success: false,
                    errorMessage: 'Geçersiz Google Token'
                };
            }

            // Email'e göre mevcut müşteriyi kontrol et
            let customer = await this.customerRepository.findOne({
                where: { email: customerData.Email }
            });

            if (customer) {
                // Müşteri varsa bilgilerini güncelle
                customer.name = customerData.Name;
                customer.profilePhotoUrl = customerData.ProfilePhotoUrl;
                customer.updatedAt = new Date();
            } else {
                // Yeni müşteri oluştur
                customer = this.customerRepository.create({
                    email: customerData.Email,
                    name: customerData.Name,
                    profilePhotoUrl: customerData.ProfilePhotoUrl,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            // Müşteriyi kaydet ve sonucu döndür
            const savedCustomer = await this.customerRepository.save(customer);

            return {
                success: true,
                data: savedCustomer
            };
        } catch (error) {
            // Hata durumunda uygun mesajı döndür
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return {
                success: false,
                errorMessage: `Müşteri oluşturulurken bir hata oluştu: ${errorMessage}`
            };
        }
    }
} 