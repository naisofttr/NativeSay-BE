import { OAuth2Client } from 'google-auth-library';
import { TokenResponse } from '../models/customer';

export class GoogleAuthService {
    private client: OAuth2Client;

    constructor() {
        if (!process.env.GOOGLE_CLIENT_ID) {
            throw new Error('GOOGLE_CLIENT_ID is not defined in environment variables');
        }
        this.client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        });
    }

    async verifyGoogleToken(token: string): Promise<boolean> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            if (!payload) {
                console.error('Token payload is empty');
                return false;
            }

            console.log('Token verification payload:', payload);
            return true;
        } catch (error) {
            console.error('Google token doğrulama detaylı hata:', error);
            return false;
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
        try {
            const { credentials } = await this.client.refreshAccessToken();
            
            if (!credentials.access_token) {
                return null;
            }

            return {
                accessToken: credentials.access_token,
                refreshToken: credentials.refresh_token || refreshToken,
                expiresIn: credentials.expiry_date ? Math.floor((credentials.expiry_date - Date.now()) / 1000) : 3600
            };
        } catch (error) {
            console.error('Refresh token hatası:', error);
            return null;
        }
    }
} 