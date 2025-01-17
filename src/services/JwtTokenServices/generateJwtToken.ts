import jwt from 'jsonwebtoken';

export const generateJwtToken = async (payload: object): Promise<string> => {
    const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
    return jwt.sign(payload, secretKey, { expiresIn: '100d' });
};
