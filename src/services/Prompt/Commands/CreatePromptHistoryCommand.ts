import { database } from '../../../config/database';
import { PromptHistory } from '../../../models/promptHistory';
import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

export interface CreatePromptHistoryDto {
    promptId: string;
    customerId: string;
    text: string;
    servicePromptResponse: string;
}

export class CreatePromptHistoryCommand {
    async execute(createPromptHistoryDto: CreatePromptHistoryDto): Promise<PromptHistory> {
        const id = uuidv4();
        const promptHistoryRef = ref(database, `promptHistory/${id}`);
        
        const promptHistoryData: PromptHistory = {
            ...createPromptHistoryDto,
            id,
            createdAt: new Date().toISOString(),
            updatedAt: null
        };
        
        await set(promptHistoryRef, promptHistoryData);
        return promptHistoryData;
    }
}
