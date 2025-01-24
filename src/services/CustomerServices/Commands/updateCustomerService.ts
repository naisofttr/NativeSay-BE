import { Customer } from '../../../models/customer';
import { database } from '../../../config/database';
import { ref, update, get } from 'firebase/database';

export class UpdateCustomerService {
    private readonly CUSTOMERS_REF = 'customers';

    async updateCustomer(customerId: string, data: Partial<Customer>): Promise<Customer> {
        try {
            // Get customer reference by ID
            const customerRef = ref(database, `${this.CUSTOMERS_REF}/${customerId}`);
            const snapshot = await get(customerRef);
            
            if (!snapshot.exists()) {
                throw new Error('Müşteri bulunamadı');
            }

            const customer = snapshot.val();

            // Update customer in Firebase
            const updatedData = {
                ...data,
                updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString()
            };

            await update(customerRef, updatedData);

            // Return updated customer data
            return {
                ...customer,
                ...updatedData
            };
        } catch (error) {
            throw error instanceof Error 
                ? error 
                : new Error('Müşteri güncellenirken bir hata oluştu');
        }
    }
}