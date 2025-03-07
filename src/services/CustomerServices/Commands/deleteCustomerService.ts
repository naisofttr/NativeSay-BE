import { database } from '../../../config/database';
import { ref, get, query, orderByChild, equalTo, remove } from 'firebase/database';
import { DeletePromptHistoryCommand } from '../../PromptHistory/Commands/DeletePromptHistoryCommand';
import { DeletePromptsCommand } from '../../Prompt/Commands/DeletePromptsCommand';

export class DeleteCustomerService {
    private deletePromptHistoryCommand: DeletePromptHistoryCommand;
    private deletePromptsCommand: DeletePromptsCommand;

    constructor() {
        this.deletePromptHistoryCommand = new DeletePromptHistoryCommand();
        this.deletePromptsCommand = new DeletePromptsCommand();
    }

    async execute(customerId: string): Promise<void> {
        try {
            const customerRef = ref(database, 'customers');
            const customerQuery = query(
                customerRef,
                orderByChild('id'),
                equalTo(customerId)
            );
    
            const snapshot = await get(customerQuery);
    
            if (!snapshot.exists()) {
                throw new Error('Customer bulunamadı');
            }
    
            const customerKey = Object.keys(snapshot.val())[0];
    
            // Önce prompt history'leri sil
            await this.deletePromptHistoryCommand.execute(customerId);
    
            // Sonra prompt'ları sil
            await this.deletePromptsCommand.execute(customerId);
    
            // En son customer'ı sil
            await remove(ref(database, `customers/${customerKey}`));
        } catch (error) {
            throw error;
        }
    }
}
