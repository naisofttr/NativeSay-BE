import { CreatedCustomerResponse } from '../models/customer';
import { CreateCustomerDto } from '../dtos/Customer/createCustomerDto';
import { LoginWithGoogleService } from './GoogleServices/loginWithGoogleService';
import { LoginWithAppleService } from './AppleServices/loginWithAppleService';
import { LoginType } from '../enums/loginType';
import { AppleTokenRequest } from '../models/auth';

export class LoginService {
    private loginWithGoogleService: LoginWithGoogleService;
    private loginWithAppleService: LoginWithAppleService;

    constructor() {
        this.loginWithGoogleService = new LoginWithGoogleService();
        this.loginWithAppleService = new LoginWithAppleService();
    }

    async handleLogin(customerData: CreateCustomerDto, loginType: LoginType): Promise<CreatedCustomerResponse> {
        switch (loginType) {
            case LoginType.GOOGLE:
                return await this.loginWithGoogleService.loginWithGoogle(customerData);

            case LoginType.APPLE:
                return await this.loginWithAppleService.loginWithApple(customerData);

            case LoginType.EMAIL:
                // Şimdilik EMAIL için bir işlem yapmıyoruz
                return {
                    success: false,
                    errorMessage: 'EMAIL login henüz desteklenmiyor'
                };

            default:
                return {
                    success: false,
                    errorMessage: 'Desteklenmeyen LoginType'
                };
        }
    }
} 