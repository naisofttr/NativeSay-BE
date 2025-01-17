import appleSignin from 'apple-signin-auth';
import { AppleAuthResponse, AppleTokenRequest, TokenResponse } from '../../models/auth';

export class AppleAuthService {
    private clientId: string;
    private teamId: string;
    private keyId: string;
    private privateKey: string;

    constructor() {
        this.clientId = process.env.APPLE_CLIENT_ID || '';
        this.teamId = process.env.APPLE_TEAM_ID || '';
        this.keyId = process.env.APPLE_KEY_ID || '';
        this.privateKey = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

        if (!this.clientId || !this.teamId || !this.keyId || !this.privateKey) {
            throw new Error('Apple kimlik doğrulama bilgileri eksik');
        }
    }

    async verifyAppleToken(request: AppleTokenRequest): Promise<AppleAuthResponse | null> {
        try {
            const redirectUri = process.env.APPLE_REDIRECT_URI;
            if (!redirectUri) {
                throw new Error('APPLE_REDIRECT_URI is not defined');
            }

            const tokenResponse = await appleSignin.getAuthorizationToken(request.code, {
                clientID: this.clientId,
                clientSecret: this.generateClientSecret(),
                redirectUri: redirectUri,
            });

            // ID token'ı doğrula ve kullanıcı bilgilerini al
            const data = await appleSignin.verifyIdToken(tokenResponse.id_token, {
                audience: this.clientId,
                ignoreExpiration: true,
            });

            return {
                id: data.sub,
                email: data.email,
                name: request.name // Apple ilk girişte isim bilgisini gönderir
            };
        } catch (error) {
            console.error('Apple token doğrulama hatası:', error);
            return null;
        }
    }

    private generateClientSecret(): string {
        return appleSignin.getClientSecret({
            clientID: this.clientId,
            teamID: this.teamId,
            keyIdentifier: this.keyId,
            privateKey: this.privateKey,
        });
    }

    async refreshAppleToken(refreshToken: string): Promise<TokenResponse | null> {
        try {
            const tokenResponse = await appleSignin.refreshAuthorizationToken(
                refreshToken,
                {
                    clientID: this.clientId,
                    clientSecret: this.generateClientSecret()
                }
            );

            if (!tokenResponse.access_token) {
                return null;
            }

            return {
                refreshToken: tokenResponse.refresh_token || refreshToken
            };
        } catch (error) {
            console.error('Apple refresh token hatası:', error);
            return null;
        }
    }
} 