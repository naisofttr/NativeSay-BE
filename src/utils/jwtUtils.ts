import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const extractCustomerIdFromToken = (req: Request): string => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization header geçersiz veya eksik');
    }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
    const jwtDecode = jwt.verify(token, secretKey) as JwtPayload;
    return jwtDecode.id;
};
