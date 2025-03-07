import { ref, remove, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../../../config/database';

export class DeletePromptsCommand {
    async execute(customerId: string): Promise<boolean> {
        try {
            const promptsRef = ref(database, 'prompts');
            const promptQuery = query(
                promptsRef,
                orderByChild('customerId'),
                equalTo(customerId)
            );

            const snapshot = await get(promptQuery);
            if (!snapshot.exists()) {
                return false;
            }

            // Tüm eşleşen prompt kayıtlarını sil
            const promptData = snapshot.val();
            const deletePromises = Object.keys(promptData).map(key => 
                remove(ref(database, `prompts/${key}`))
            );
            
            await Promise.all(deletePromises);
            return true;
        } catch (error) {
            console.error('Promptlar silinirken bir hata oluştu:', error);
            throw new Error('Promptlar silinirken bir hata oluştu');
        }
    }
}
