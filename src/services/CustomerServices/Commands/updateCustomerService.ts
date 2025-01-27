import { Customer } from '../../../models/customer';
import { database } from '../../../config/database';
import { ref, update } from 'firebase/database';
import { MembershipType } from '../../../enums/MembershipType';

interface UpdateCustomerData extends Partial<Omit<Customer, 'createdAt'>> {
    id: string;
    email: string;
    name: string;
    profilePhotoUrl?: string | null;
    refreshToken?: string;
    refreshTokenExpiryDate?: Date;
    membershipType: MembershipType;
    clientDate: Date;
}

export class UpdateCustomerService {
    private readonly CUSTOMERS_REF = 'customers';

    async updateCustomer(data: UpdateCustomerData): Promise<Customer> {
        const customerRef = ref(database, `${this.CUSTOMERS_REF}/${data.id}`);

        const customer: Customer = {
            id: data.id,
            email: data.email,
            name: data.name,
            profilePhotoUrl: data.profilePhotoUrl || null,
            refreshToken: data.refreshToken,
            refreshTokenExpiryDate: data.refreshTokenExpiryDate,
            membershipType: data.membershipType,
            updatedAt: data.clientDate
        };
        // dogru calismadigi icin gecici olarak update islemleri devre disi birakildi.
        //await update(customerRef, customer);
        return customer;
    }
}