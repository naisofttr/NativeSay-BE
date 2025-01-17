import { CreatedCustomerResponse } from '../models/customer';
import { CreateCustomerDto } from '../dtos/createCustomerDto';
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
                const appleData: AppleTokenRequest = {
                    code: customerData.IdToken, // Assuming IdToken is used as the code for Apple
                    name: {
                        firstName: customerData.Name.split(' ')[0],
                        lastName: customerData.Name.split(' ')[1] || ''
                    }
                };
                return await this.loginWithAppleService.loginWithApple(appleData);

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