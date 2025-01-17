import { Customer } from '../../../models/customer';
import { AppDataSource } from '../../../config/database';

export class CreateCustomerService {
    private customerRepository = AppDataSource.getRepository(Customer);

    async createCustomer(data: Partial<Customer>): Promise<Customer> {
        const customer = this.customerRepository.create(data);
        return await this.customerRepository.save(customer);
    }
} 