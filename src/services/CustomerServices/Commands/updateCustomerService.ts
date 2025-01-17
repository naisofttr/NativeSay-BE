import { Customer } from '../../../models/customer';
import { AppDataSource } from '../../../config/database';

export class UpdateCustomerService {
    private customerRepository = AppDataSource.getRepository(Customer);

    async updateCustomer(customer: Customer, data: Partial<Customer>): Promise<Customer> {
        Object.assign(customer, data);
        return await this.customerRepository.save(customer);
    }
} 