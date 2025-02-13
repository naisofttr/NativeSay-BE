import { Request, Response } from 'express';
import { LoginService } from '../services/loginService';
import { CreateCustomerDto } from '../dtos/Customer/createCustomerDto';
import { MembershipType } from '../enums/MembershipType';

export class AuthController {
    private loginService: LoginService;

    constructor() {
        this.loginService = new LoginService();
    }

    async login(req: Request, res: Response) {
        try {
            const { IdToken, ClientDate, Email, Name, ProfilePhotoUrl, LoginType: loginType, MembershipType: membershipType, Platform } = req.body;

            if (!IdToken || !ClientDate || !Email || !Name || !loginType || !Platform) {
                return res.status(400).json({
                    success: false,
                    message: 'IdToken, ClientDate, Email, Name, LoginType ve Platform zorunlu alanlardır'
                });
            }

            const customerData: CreateCustomerDto = { 
                IdToken, 
                Email, 
                Name, 
                ProfilePhotoUrl, 
                ClientDate,
                MembershipType: membershipType || MembershipType.FREE,
                Platform
            };
            const result = await this.loginService.handleLogin(customerData, loginType);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.errorMessage
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                message: 'Giriş başarılı'
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Giriş işlemi sırasında bir hata oluştu',
                error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
            });
        }
    }
} 