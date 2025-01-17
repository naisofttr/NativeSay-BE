// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyRefreshToken } from '../services/JwtTokenServices/verifyRefreshToken';

export const verifyRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Yetkisiz erişim' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const isValid = await verifyRefreshToken(token);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Geçersiz veya süresi dolmuş token' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Token doğrulama hatası' });
    }
};