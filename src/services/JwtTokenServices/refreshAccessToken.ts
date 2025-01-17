import { generateJwtToken } from './generateJwtToken';
import { TokenResponse } from '../../models/auth';

export const refreshAccessToken = async (email: string): Promise<TokenResponse | null> => {
    try {
        // JWT token oluştur
        const payload = {
            email: email, // Kullanıcının e-posta adresi
        };
        const jwtToken = await generateJwtToken(payload);

        return {
            refreshToken: jwtToken
        };
    } catch (error) {
        console.error('JWT token oluşturma hatası:', error);
        return null;
    }
};
