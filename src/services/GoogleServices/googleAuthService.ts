import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { TokenResponse } from '../../models/auth';
import { Platform } from '../../enums/Platform';

export class GoogleAuthService {
    private client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client();
    }

    private getClientId(platform: Platform): string {
        const clientId = process.env[`GOOGLE_CLIENT_ID_${platform}`];
        if (!clientId) {
            throw new Error(`GOOGLE_CLIENT_ID_${platform} is not defined in environment variables`);
        }
        return clientId;
    }

    async verifyGoogleToken(token: string, platform: Platform): Promise<boolean> {
        try {
            const clientId = this.getClientId(platform);
            
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: clientId
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
}