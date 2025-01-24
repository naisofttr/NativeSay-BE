import { ref, remove, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../../../config/database';

export class DeletePromptByServicePromptResponseCommand {
    async execute(servicePromptResponse: string): Promise<boolean> {
        try {
            const promptsRef = ref(database, 'prompts');
            const promptQuery = query(
                promptsRef,
                orderByChild('servicePromptResponse'),
                equalTo(servicePromptResponse)
            );

            const snapshot = await get(promptQuery);
            if (!snapshot.exists()) {
                return false;
            }

            // İlk eşleşen promptu bul ve sil
            const promptData = snapshot.val();
            const promptKey = Object.keys(promptData)[0];
            const promptRef = ref(database, `prompts/${promptKey}`);
            await remove(promptRef);
            
            return true;
        } catch (error) {
            console.error('Prompt silinirken bir hata oluştu:', error);
            throw new Error('Prompt silinirken bir hata oluştu');
        }
    }
}
