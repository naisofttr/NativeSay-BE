import { database } from '../../../config/database';
import { CreatePromptDto } from '../../../dtos/Prompt/CreatePromptDto';
import { Prompt } from '../../../models/prompt';
import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

export class CreatePromptCommand {
    async execute(createPromptDto: CreatePromptDto): Promise<Prompt> {
        const id = uuidv4();
        const promptsRef = ref(database, `prompts/${id}`);
        
        const promptData = {
            ...createPromptDto,
            customerId: createPromptDto.customerId,
            id,
            confirmedCount: 0,
            promptServiceType: createPromptDto.promptServiceType
        };
        
        await set(promptsRef, promptData);
        return promptData as Prompt;
    }
}