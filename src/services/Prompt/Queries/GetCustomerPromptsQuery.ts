import { database } from '../../../config/database';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { CustomerPromptResponseDto } from '../../../dtos/Prompt/CustomerPromptResponseDto';

interface PromptData {
    text: string;
    servicePromptResponse: string;
    customerId: string;
    createdAt: string;
}

export class GetCustomerPromptsQuery {
    async execute(customerId: string): Promise<CustomerPromptResponseDto[]> {
        try {
            const promptsRef = ref(database, 'promptHistory');
            
            // Önce customerId'ye göre filtrele
            const customerPromptsQuery = query(
                promptsRef,
                orderByChild('customerId'),
                equalTo(customerId)
            );

            const snapshot = await get(customerPromptsQuery);
            
            if (!snapshot.exists()) {
                return [];
            }

            // Tüm promptları al ve createdAt'e göre sırala
            const allPrompts = Object.values(snapshot.val() as Record<string, PromptData>);
            
            // En yeniden en eskiye doğru sırala
            const sortedPrompts = allPrompts.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            return sortedPrompts.map(prompt => ({
                text: prompt.text,
                servicePromptResponse: prompt.servicePromptResponse
            }));

        } catch (error) {
            console.error('Prompts getirme hatası:', error);
            throw error;
        }
    }
}
