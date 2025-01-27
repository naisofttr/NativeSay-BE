import { ref, query, orderByChild, equalTo, get, update } from 'firebase/database';
import { database } from '../../../config/database';
import { Prompt } from '../../../models/prompt';

export interface UpdatePromptConfirmedCountRequest {
    servicePromptResponse: string;
    confirmedCount: number;
}

export class UpdatePromptConfirmedCountCommand {
    async execute(request: UpdatePromptConfirmedCountRequest): Promise<void> {
        try {
            const promptsRef = ref(database, 'prompts');
            
            // servicePromptResponse'a göre prompt'u bul
            const promptQuery = query(
                promptsRef,
                orderByChild('servicePromptResponse'),
                equalTo(request.servicePromptResponse)
            );

            const snapshot = await get(promptQuery);
            
            if (!snapshot.exists()) {
                throw new Error('Prompt bulunamadı');
            }

            // İlk eşleşen prompt'u al
            const [promptId, promptData] = Object.entries(snapshot.val())[0];
            
            // confirmedCount'u güncelle
            const updates = {
                [`/prompts/${promptId}/confirmedCount`]: request.confirmedCount
            };

            await update(ref(database), updates);

        } catch (error) {
            console.error('UpdatePromptConfirmedCountCommand error:', error);
            throw error;
        }
    }
}