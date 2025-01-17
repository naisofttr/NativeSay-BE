import jwt from 'jsonwebtoken';

export const verifyRefreshToken = async (token: string): Promise<boolean> => {
    try {
        const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
        jwt.verify(token, secretKey);
        return true;
    } catch (error) {
        console.error('Token doğrulama hatası:', error);
        return false;
    }
};
