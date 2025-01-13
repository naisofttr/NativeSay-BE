import { OAuth2Client } from 'google-auth-library';

export class GoogleAuthService {
    private client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async verifyGoogleToken(token: string): Promise<boolean> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            return payload ? true : false;
        } catch (error) {
            console.error('Google token doğrulama hatası:', error);
            return false;
        }
    }
} 