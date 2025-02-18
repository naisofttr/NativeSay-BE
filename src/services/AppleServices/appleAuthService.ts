import appleSignin from 'apple-signin-auth';
import { AppleAuthResponse } from '../../models/auth';
import { Platform } from '../../enums/Platform';
import jwt from 'jsonwebtoken';

export class AppleAuthService {
    constructor() {}

    private getClientId(platform: Platform): string {
        const clientId = process.env[`APPLE_CLIENT_ID`];
        if (!clientId) {
            throw new Error(`APPLE_CLIENT_ID is not defined in environment variables`);
        }
        return clientId;
    }

    async verifyAppleToken(idToken: string, platform: Platform): Promise<string | null> {
        try {
            const clientId = this.getClientId(platform);

            // ID token'ı doğrula ve kullanıcı bilgilerini al
            const data = await appleSignin.verifyIdToken(idToken, {
                audience: clientId,
                ignoreExpiration: true,
            });

            return data.email || null;
        } catch (error) {
            console.error('Apple token doğrulama hatası:', error);
            if (error instanceof Error) {
                console.error('Hata tipi:', error.name);
                console.error('Hata mesajı:', error.message);
                console.error('Hata stack:', error.stack);
            }
            return null;
        }
    }
}