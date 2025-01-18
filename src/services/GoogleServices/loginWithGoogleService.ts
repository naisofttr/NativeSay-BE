import { CreatedCustomerResponse, Customer } from '../../models/customer';
import { CreateCustomerDto } from '../../dtos/Customer/createCustomerDto';
import { GoogleAuthService } from './googleAuthService';
import { CreateCustomerService } from '../CustomerServices/Commands/createCustomerService';
import { UpdateCustomerService } from '../CustomerServices/Commands/updateCustomerService';
import { AppDataSource } from '../../config/database';
import { refreshAccessToken } from '../JwtTokenServices/refreshAccessToken';

export class LoginWithGoogleService {
    private googleAuthService: GoogleAuthService;
    private createCustomerService: CreateCustomerService;
    private updateCustomerService: UpdateCustomerService;
    private customerRepository = AppDataSource.getRepository(Customer);

    constructor() {
        this.googleAuthService = new GoogleAuthService();
        this.createCustomerService = new CreateCustomerService();
        this.updateCustomerService = new UpdateCustomerService();
    }

    private async validateGoogleToken(idToken: string): Promise<boolean> {
        return await this.googleAuthService.verifyGoogleToken(idToken);
    }

    async loginWithGoogle(customerData: CreateCustomerDto): Promise<CreatedCustomerResponse> {
        try {
            // Google token'ı doğrula
            const isValidToken = await this.validateGoogleToken(customerData.IdToken);
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

            // Refresh token işlemleri
            const tokenInfo = await refreshAccessToken(customerData.Email);
            if (!tokenInfo) {
                return {
                    success: false,
                    errorMessage: 'Refresh token alınamadı'
                };
            }

            // clientDate'e 100 gün ekle
            const clientDate = new Date(customerData.ClientDate);
            const refreshTokenExpiryDate = new Date(clientDate);
            refreshTokenExpiryDate.setDate(refreshTokenExpiryDate.getDate() + 100);

            if (customer) {
                // Müşteri varsa bilgilerini güncelle
                customer = await this.updateCustomerService.updateCustomer(customer, {
                    name: customerData.Name,
                    profilePhotoUrl: customerData.ProfilePhotoUrl,
                    refreshToken: tokenInfo.refreshToken,
                    refreshTokenExpiryDate: refreshTokenExpiryDate,
                    updatedAt: clientDate
                });
            } else {
                // Yeni müşteri oluştur
                customer = await this.createCustomerService.createCustomer({
                    email: customerData.Email,
                    name: customerData.Name,
                    profilePhotoUrl: customerData.ProfilePhotoUrl,
                    refreshToken: tokenInfo.refreshToken,
                    refreshTokenExpiryDate: refreshTokenExpiryDate,
                    createdAt: clientDate,
                    updatedAt: null
                });
            }

            return {
                success: true,
                data: customer
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