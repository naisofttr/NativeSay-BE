import { TokenResponse } from '../models/auth';
import { GoogleAuthService } from './googleAuthService';
import { AppDataSource } from '../config/database';
import { Customer } from '../models/customer';
import { AppleAuthService } from './appleAuthService';

export class AuthService {
    private customerRepository = AppDataSource.getRepository(Customer);
    private googleAuthService: GoogleAuthService;
    private appleAuthService: AppleAuthService;

    constructor() {
        this.googleAuthService = new GoogleAuthService();
        this.appleAuthService = new AppleAuthService();
    }

    async refreshToken(refreshToken: string, clientDate: string, provider: 'google' | 'apple' = 'google'): Promise<TokenResponse | null> {
        try {
            const customer = await this.customerRepository.findOne({
                where: { refreshToken }
            });

            if (!customer || !customer.refreshTokenExpiryDate || customer.refreshTokenExpiryDate < new Date()) {
                return null;
            }

            const newTokens = provider === 'google' 
                ? await this.googleAuthService.refreshAccessToken(refreshToken)
                : await this.appleAuthService.refreshAppleToken(refreshToken);

            if (!newTokens) {
                return null;
            }

            // Refresh token'ı güncelle
            customer.refreshToken = newTokens.refreshToken;
            
            // Client'ın gönderdiği tarih bilgisini kullan
            const clientDateTime = new Date(clientDate);
            customer.refreshTokenExpiryDate = new Date(clientDateTime.getTime() + (newTokens.expiresIn * 1000));
            
            await this.customerRepository.save(customer);

            return newTokens;
        } catch (error) {
            console.error('Token yenileme hatası:', error);
            return null;
        }
    }
} 