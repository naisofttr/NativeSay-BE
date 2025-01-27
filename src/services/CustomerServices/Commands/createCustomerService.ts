import { Customer } from '../../../models/customer';
import { database } from '../../../config/database';
import { ref, push, set } from 'firebase/database';
import { MembershipType } from '../../../enums/MembershipType';

interface CreateCustomerData {
    id: string;
    email: string;
    name: string;
    profilePhotoUrl?: string | null;
    refreshToken?: string;
    refreshTokenExpiryDate?: Date;
    membershipType: MembershipType;
    clientDate: Date;
}

export class CreateCustomerService {
    async createCustomer(data: CreateCustomerData): Promise<Customer> {
        const customersRef = ref(database, 'customers');
        const newCustomerRef = push(customersRef);
        
        const customer: Customer = {
            id: data.id,
            email: data.email,
            name: data.name,
            profilePhotoUrl: data.profilePhotoUrl || null,
            refreshToken: data.refreshToken,
            refreshTokenExpiryDate: data.refreshTokenExpiryDate,
            membershipType: data.membershipType,
            createdAt: data.clientDate,
            updatedAt: null
        };

        await set(newCustomerRef, customer);
        return customer;
    }
}