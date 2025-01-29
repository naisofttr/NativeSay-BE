import { ref, get, query, equalTo } from 'firebase/database';
import { database } from '../../../config/database';
import { Customer } from '../../../models/customer';

export interface GetCustomerByIdResponse {
    success: boolean;
    data?: Customer;
    errorMessage?: string;
}

export class GetCustomerByIdQuery {
    private readonly CUSTOMERS_REF = 'customers';

    async execute(id: string): Promise<GetCustomerByIdResponse> {
        try {
            if (!id) {
                return {
                    success: false,
                    errorMessage: 'Customer ID is required'
                };
            }

            const customerQuery = query(
                ref(database, this.CUSTOMERS_REF),
                equalTo(id)
            );

            const snapshot = await get(customerQuery);
            let customer: Customer | null = null;

            if (snapshot.exists()) {
                const customerData = snapshot.val();
                const customerKey = Object.keys(customerData)[0];
                customer = customerData[customerKey];
            }

            if (!snapshot.exists()) {
                return {
                    success: false,
                    errorMessage: 'Customer not found'
                };
            }

            const customerData = snapshot.val();
            return {
                success: true,
                data: customerData as Customer
            };

        } catch (error) {
            console.error('Error getting customer by ID:', error);
            return {
                success: false,
                errorMessage: 'An error occurred while fetching the customer'
            };
        }
    }
}