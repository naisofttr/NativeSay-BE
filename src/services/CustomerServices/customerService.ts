import { ref, get, set, query, orderByChild, equalTo } from 'firebase/database';
import { database } from "../../config/database";
import { Customer, CreatedCustomerResponse } from "../../models/customer";
import { refreshAccessToken } from "../JwtTokenServices/refreshAccessToken";
import { MembershipType } from "../../enums/MembershipType";
import { v4 as uuidv4 } from 'uuid';

export class CustomerService {
    private readonly CUSTOMERS_REF = 'customers';

    async handleCustomerService(
        email: string,
        name: string,
        profilePhotoUrl: string,
        clientDate: Date,
        membershipType: MembershipType = MembershipType.FREE
    ): Promise<CreatedCustomerResponse> {
        try {
            // Email'e göre müşteri ara
            const customerQuery = query(
                ref(database, this.CUSTOMERS_REF),
                orderByChild('email'),
                equalTo(email)
            );
            
            const snapshot = await get(customerQuery);
            let customer: Customer | null = null;
            let id = uuidv4();

            if (snapshot.exists()) {
                const customerData = snapshot.val();
                const customerKey = Object.keys(customerData)[0];
                customer = customerData[customerKey];
                id = customer?.id || id;  
            }

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

            const customerData: Customer = {
                id,
                email,
                name,
                profilePhotoUrl,
                refreshToken: tokenInfo.refreshToken,
                refreshTokenExpiryDate,
                membershipType,
                createdAt: customer?.createdAt || clientDate,
                updatedAt: clientDate
            };

            // Firebase'e kaydet
            const customerRef = ref(database, `${this.CUSTOMERS_REF}/${id}`);
            await set(customerRef, customerData);

            return {
                success: true,
                data: customerData
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
