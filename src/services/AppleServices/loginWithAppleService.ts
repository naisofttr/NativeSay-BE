import { CreateCustomerDto } from "../../dtos/Customer/createCustomerDto";
import { CreatedCustomerResponse } from "../../models/customer";
import { CustomerService } from "../CustomerServices/customerService";
import { AppleAuthService } from "./appleAuthService";
import { Platform } from "../../enums/Platform";

export class LoginWithAppleService {
    private appleAuthService: AppleAuthService;
    private customerService: CustomerService;

    constructor() {
        this.appleAuthService = new AppleAuthService();
        this.customerService = new CustomerService();
    }

    private async validateAppleToken(idToken: string, platform: Platform): Promise<string | null> {
        return await this.appleAuthService.verifyAppleToken(idToken, platform);
    }

    async loginWithApple(customerData: CreateCustomerDto): Promise<CreatedCustomerResponse> {
        try {
            // Apple token'ı doğrula ve email al
            const userEmail = await this.validateAppleToken(customerData.IdToken, customerData.Platform);
            
            if (!userEmail) {
                return {
                    success: false,
                    errorMessage: 'Geçersiz Apple Token'
                };
            }

            return await this.customerService.handleCustomerService(
                userEmail, // Apple'dan gelen email
                '',
                customerData.ProfilePhotoUrl || '',
                customerData.ClientDate,
                customerData.MembershipType
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return {
                success: false,
                errorMessage: `Apple ile müşteri oluşturulurken bir hata oluştu: ${errorMessage}`
            };
        }
    }
}