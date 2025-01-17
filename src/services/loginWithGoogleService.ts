import { Customer, CreatedCustomerResponse } from '../models/customer';
import { CreateCustomerDto } from '../dtos/createCustomerDto';
import { GoogleAuthService } from './googleAuthService';
import { AppDataSource } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class LoginWithGoogleService {
    private customerRepository = AppDataSource.getRepository(Customer);
    private googleAuthService: GoogleAuthService;

    constructor() {
        this.googleAuthService = new GoogleAuthService();
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

            // customerId oluştur
            const customerId = customer ? customer.id : uuidv4();

            // Refresh token işlemleri
            const tokenInfo = await this.googleAuthService.refreshAccessToken(customerId.toString(), customerData.Email);
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
                customer.name = customerData.Name;
                customer.profilePhotoUrl = customerData.ProfilePhotoUrl;
                customer.refreshToken = tokenInfo.refreshToken;
                customer.refreshTokenExpiryDate = refreshTokenExpiryDate;
                customer.updatedAt = clientDate;
            } else {
                // Yeni müşteri oluştur
                customer = this.customerRepository.create({
                    email: customerData.Email,
                    name: customerData.Name,
                    profilePhotoUrl: customerData.ProfilePhotoUrl,
                    refreshToken: tokenInfo.refreshToken,
                    refreshTokenExpiryDate: refreshTokenExpiryDate,
                    createdAt: clientDate
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