import { AppDataSource } from "../../config/database";
import { Customer, CreatedCustomerResponse } from "../../models/customer";
import { CreateCustomerService } from "./Commands/createCustomerService";
import { UpdateCustomerService } from "./Commands/updateCustomerService";
import { refreshAccessToken } from "../JwtTokenServices/refreshAccessToken";

export class CustomerService {
    private customerRepository = AppDataSource.getRepository(Customer);
    private createCustomerService: CreateCustomerService;
    private updateCustomerService: UpdateCustomerService;

    constructor() {
        this.createCustomerService = new CreateCustomerService();
        this.updateCustomerService = new UpdateCustomerService();
    }

    async handleCustomerService(email: string, name: string, profilePhotoUrl: string, clientDate: Date): Promise<CreatedCustomerResponse> {
        try {
            let customer = await this.customerRepository.findOne({
                where: { email }
            });

            const { v4: uuidv4 } = require('uuid');
            const id = uuidv4();

            // Refresh token işlemleri
            const tokenInfo = await refreshAccessToken(id, email);
            if (!tokenInfo) {
                return {
                    success: false,
                    errorMessage: 'Refresh token alınamadı'
                };
            }

            // clientDate'e 100 gün ekle
            const refreshTokenExpiryDate = new Date(clientDate);
            refreshTokenExpiryDate.setDate(refreshTokenExpiryDate.getDate() + 100);

            if (customer) {
                // Müşteri varsa bilgilerini güncelle
                customer = await this.updateCustomerService.updateCustomer(customer, {
                    name,
                    profilePhotoUrl,
                    refreshToken: tokenInfo.refreshToken,
                    refreshTokenExpiryDate,
                    updatedAt: clientDate
                });
            } else {
                // Yeni müşteri oluştur
                customer = await this.createCustomerService.createCustomer({
                    id,
                    email,
                    name,
                    profilePhotoUrl,
                    refreshToken: tokenInfo.refreshToken,
                    refreshTokenExpiryDate,
                    createdAt: clientDate,
                    updatedAt: null
                });
            }

            return {
                success: true,
                data: customer
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return {
                success: false,
                errorMessage: `Müşteri kimlik doğrulama işlemi sırasında bir hata oluştu: ${errorMessage}`
            };
        }
    }
}
function uuidv4() {
    throw new Error("Function not implemented.");
}

