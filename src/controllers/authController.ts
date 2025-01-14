import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token zorunludur'
                });
            }

            const newTokens = await this.authService.refreshToken(refreshToken);

            if (!newTokens) {
                return res.status(401).json({
                    success: false,
                    message: 'Geçersiz veya süresi dolmuş refresh token'
                });
            }

            return res.status(200).json({
                success: true,
                data: newTokens
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Token yenileme işlemi başarısız',
                error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
            });
        }
    }
} 