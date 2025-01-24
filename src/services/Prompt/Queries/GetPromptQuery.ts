import { database } from '../../../config/database';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { Prompt } from '../../../models/prompt';

export class GetPromptQuery {
    async execute(text: string, languageCode: string): Promise<Prompt | null> {
        try {
            // prompts koleksiyonunda text ve languageCode'a göre sorgu yapıyoruz
            const promptsRef = ref(database, 'prompts');
            const promptQuery = query(
                promptsRef,
                orderByChild('text'),
                equalTo(text)
            );

            const snapshot = await get(promptQuery);
            
            if (!snapshot.exists()) {
                return null;
            }

            // Firebase'den gelen verileri array'e çevirip language kontrolü yapıyoruz
            const prompts = Object.values(snapshot.val()) as Prompt[];
            const prompt = prompts.find(p => p.languageCode === languageCode);

            return prompt || null;
        } catch (error) {
            console.error('Prompt arama hatası:', error);
            throw error;
        }
    }
}