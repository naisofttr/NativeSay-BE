import { ref, remove, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../../../config/database';

export class DeletePromptHistoryCommand {
    async execute(customerId: string): Promise<boolean> {
        try {
            const promptHistoryRef = ref(database, 'promptHistory');
            const promptHistoryQuery = query(
                promptHistoryRef,
                orderByChild('customerId'),
                equalTo(customerId)
            );

            const snapshot = await get(promptHistoryQuery);
            if (!snapshot.exists()) {
                return false;
            }

            // Tüm eşleşen promptHistory kayıtlarını sil
            const promptHistoryData = snapshot.val();
            const deletePromises = Object.keys(promptHistoryData).map(key => 
                remove(ref(database, `promptHistory/${key}`))
            );
            
            await Promise.all(deletePromises);
            return true;
        } catch (error) {
            console.error('PromptHistory silinirken bir hata oluştu:', error);
            throw new Error('PromptHistory silinirken bir hata oluştu');
        }
    }
}
