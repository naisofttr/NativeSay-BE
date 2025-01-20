import { CreatedCustomerResponse, Customer } from '../../models/customer';
import { CreateCustomerDto } from '../../dtos/Customer/createCustomerDto';
import { GoogleAuthService } from './googleAuthService';
import { CustomerService } from '../CustomerServices/customerService';

export class LoginWithGoogleService {
    private googleAuthService: GoogleAuthService;
    private customerService: CustomerService;

    constructor() {
        this.googleAuthService = new GoogleAuthService();
        this.customerService = new CustomerService();
    }

    private async validateGoogleToken(idToken: string): Promise<boolean> {
        return await this.googleAuthService.verifyGoogleToken(idToken);
    }

    async loginWithGoogle(customerData: CreateCustomerDto): Promise<CreatedCustomerResponse> {
        try {
            // Google token'ı doğrula
            const isValidToken = await this.validateGoogleToken(customerData.IdToken);
            if (!isValidToken) {
                return {
                    success: false,
                    errorMessage: 'Geçersiz Google Token'
                };
            }

            return await this.customerService.handleCustomerService(
                customerData.Email,
                customerData.Name,
                customerData.ProfilePhotoUrl || '', 
                new Date(customerData.ClientDate)
            );
        } catch (error) {
            // Hata durumunda uygun mesajı döndür
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return {
                success: false,
                errorMessage: `Müşteri oluşturulurken bir hata oluştu: ${errorMessage}`
            };
        }
    }
} 