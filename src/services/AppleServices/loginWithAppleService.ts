import { CreateCustomerDto } from "../../dtos/Customer/createCustomerDto";
import { CreatedCustomerResponse } from "../../models/customer";
import { CustomerService } from "../CustomerServices/customerService";
import { AppleAuthService } from "./appleAuthService";

export class LoginWithAppleService {
    private appleAuthService: AppleAuthService;
    private customerService: CustomerService;

    constructor() {
        this.appleAuthService = new AppleAuthService();
        this.customerService = new CustomerService();
    }

    async loginWithApple(customerData: CreateCustomerDto): Promise<CreatedCustomerResponse> {
        try {
            const appleUser = await this.appleAuthService.verifyAppleToken(customerData);
            if (!appleUser || !appleUser.email || !customerData.Name) {
                return {
                    success: false,
                    errorMessage: 'Geçersiz Apple Token'
                };
            }

            return await this.customerService.handleCustomerService(
                appleUser.email,
                customerData.Name,
                customerData.ProfilePhotoUrl || '', 
                new Date(customerData.ClientDate),
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