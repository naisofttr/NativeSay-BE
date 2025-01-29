import { database } from '../../../config/database';
import { ref, update, get, query, orderByChild, equalTo } from 'firebase/database';
import { Customer } from '../../../models/customer';

export class UpdateCustomerService {
    async execute(req: Customer): Promise<void> {
        try {
            const customerRef = ref(database, 'customers');

            // id'a göre customer'u bul
            const customerQuery = query(
                customerRef,
                orderByChild('id'),
                equalTo(req.id)
            );

            const snapshot = await get(customerQuery);

            if (!snapshot.exists()) {
                throw new Error('Customer bulunamadı');
            }

            // membershipType güncelle
            const updates = {
                [`/customers/${req.id}/membershipType`]: req.membershipType
            };

            await update(ref(database), updates);

        } catch (error) {
            console.error('Error updating customer:', error);
            throw error;
        }
    }
}

