import { TokenResponse } from '../models/auth';
import { GoogleAuthService } from './googleAuthService';
import { AppDataSource } from '../config/database';
import { Customer } from '../models/customer';

export class AuthService {
    private customerRepository = AppDataSource.getRepository(Customer);
    private googleAuthService: GoogleAuthService;

    constructor() {
        this.googleAuthService = new GoogleAuthService();
    }

    async refreshToken(refreshToken: string, clientDate: string): Promise<TokenResponse | null> {
        try {
            const customer = await this.customerRepository.findOne({
                where: { refreshToken }
            });

            if (!customer || !customer.refreshTokenExpiryDate || customer.refreshTokenExpiryDate < new Date()) {
                return null;
            }

            const newTokens = await this.googleAuthService.refreshAccessToken(refreshToken);
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