import { Customer, CreateCustomerDto, CreatedCustomerResponse } from '../models/customer';
import { GoogleAuthService } from './googleAuthService';
import { AppDataSource } from '../config/database';
import { AppleAuthService } from './appleAuthService';
import { AppleTokenRequest } from '../models/auth';

export class CustomerService {
    private customerRepository = AppDataSource.getRepository(Customer);
    private googleAuthService: GoogleAuthService;
    private appleAuthService: AppleAuthService;

    constructor() {
        this.googleAuthService = new GoogleAuthService();
        this.appleAuthService = new AppleAuthService();
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

    async createCustomerWithApple(appleData: AppleTokenRequest): Promise<CreatedCustomerResponse> {
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