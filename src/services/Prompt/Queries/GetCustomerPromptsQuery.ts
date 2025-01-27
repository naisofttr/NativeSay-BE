import { database } from '../../../config/database';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { CustomerPromptResponseDto } from '../../../dtos/Prompt/CustomerPromptResponseDto';

interface PromptData {
    text: string;
    servicePromptResponse: string;
    customerId: string;
}

export class GetCustomerPromptsQuery {
    async execute(customerId: string): Promise<CustomerPromptResponseDto[]> {
        try {
            const promptsRef = ref(database, 'prompts');
            const promptQuery = query(
                promptsRef,
                orderByChild('customerId'),
                equalTo(customerId)
            );

            const snapshot = await get(promptQuery);
            
            if (!snapshot.exists()) {
                return [];
            }

            return Object.values(snapshot.val() as Record<string, PromptData>).map(prompt => ({
                text: prompt.text,
                servicePromptResponse: prompt.servicePromptResponse
            }));

        } catch (error) {
            console.error('Prompts getirme hatası:', error);
            throw error;
        }
    }
}
