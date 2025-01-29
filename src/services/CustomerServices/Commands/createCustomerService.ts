import { Customer } from '../../../models/customer';
import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { MembershipType } from '../../../enums/MembershipType';

interface CreateCustomerData {
    id: string;
    email: string;
    name: string;
    profilePhotoUrl?: string | null;
    refreshToken?: string;
    refreshTokenExpiryDate?: Date;
    membershipType: MembershipType;
    createdAt?: string;
}

export class CreateCustomerService {
    async createCustomer(data: CreateCustomerData): Promise<Customer> {
        const id = data.id;
        const customersRef = ref(database, `customers/${id}`);
        
        const customerData = {
            ...data,
            id,
        };
        
        await set(customersRef, customerData);
        return customerData as Customer;
    }
}