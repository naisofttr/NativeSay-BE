import { database } from '../../../config/database';
import { CreatePromptDto } from '../../../dtos/Prompt/CreatePromptDto';
import { Prompt } from '../../../models/prompt';
import { ref, push, set } from 'firebase/database';

export class CreatePromptCommand {
    async execute(createPromptDto: CreatePromptDto): Promise<Prompt> {
        const promptsRef = ref(database, 'prompts');
        const newPromptRef = push(promptsRef);
        
        const promptData = {
            ...createPromptDto,
            customerId: createPromptDto.customerId,
            id: newPromptRef.key
        };
        
        await set(newPromptRef, promptData);
        return promptData as Prompt;
    }
}