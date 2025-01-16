import { Customer, CreateCustomerDto, CreatedCustomerResponse } from '../models/customer';
import { GoogleAuthService } from './googleAuthService';
import { AppDataSource } from '../config/database';
import { TokenResponse } from '../models/auth';
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
     * @returns Oluşturulan/güncellenen müşteri bilgisi ve token bilgileri
     */
    async createCustomer(customerData: CreateCustomerDto): Promise<CreatedCustomerResponse> {
        try {
            // Google token'ı doğrula ve kullanıcı bilgilerini al
            const tokenInfo = await this.googleAuthService.verifyAndGetTokenInfo(customerData.IdToken);
            if (!tokenInfo.isValid) {
                return {
                    success: false,
                    errorMessage: 'Geçersiz Google Token'
                };
            }

            // Email'e göre mevcut müşteriyi kontrol et
            let customer = await this.customerRepository.findOne({
                where: { email: customerData.Email }
            });

            const clientDateTime = new Date(customerData.clientDate);
            const tokenExpiryDate = new Date(clientDateTime.getTime() + (tokenInfo.tokens.expiresIn * 1000));

            if (customer) {
                // Müşteri varsa bilgilerini güncelle
                customer.name = customerData.Name;
                customer.profilePhotoUrl = customerData.ProfilePhotoUrl;
                customer.refreshToken = tokenInfo.tokens.refreshToken;
                customer.refreshTokenExpiryDate = tokenExpiryDate;
                customer.updatedAt = clientDateTime;
            } else {
                // Yeni müşteri oluştur
                customer = this.customerRepository.create({
                    email: customerData.Email,
                    name: customerData.Name,
                    profilePhotoUrl: customerData.ProfilePhotoUrl,
                    refreshToken: tokenInfo.tokens.refreshToken,
                    refreshTokenExpiryDate: tokenExpiryDate,
                    createdAt: clientDateTime,
                    updatedAt: clientDateTime
                });
            }

            // Müşteriyi kaydet
            const savedCustomer = await this.customerRepository.save(customer);

            return {
                success: true,
                data: savedCustomer,
                tokens: tokenInfo.tokens
            };
        } catch (error) {
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

            const clientDateTime = new Date(appleData.clientDate);
            const tokenExpiryDate = new Date(clientDateTime.getTime() + 3600 * 1000);

            if (customer) {
                // Müşteri varsa bilgilerini güncelle
                if (appleUser.name) {
                    customer.name = `${appleUser.name.firstName} ${appleUser.name.lastName}`.trim();
                }
                customer.refreshToken = appleData.code;
                customer.refreshTokenExpiryDate = tokenExpiryDate;
                customer.updatedAt = clientDateTime;
            } else {
                // Yeni müşteri oluştur
                customer = this.customerRepository.create({
                    email: appleUser.email,
                    name: appleUser.name ? 
                        `${appleUser.name.firstName} ${appleUser.name.lastName}`.trim() : 
                        appleUser.email.split('@')[0],
                    refreshToken: appleData.code,
                    refreshTokenExpiryDate: tokenExpiryDate,
                    createdAt: clientDateTime,
                    updatedAt: clientDateTime
                });
            }

            const savedCustomer = await this.customerRepository.save(customer);

            return {
                success: true,
                data: savedCustomer,
                tokens: {
                    accessToken: appleData.code,
                    refreshToken: appleData.code,
                    expiresIn: 3600
                }
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