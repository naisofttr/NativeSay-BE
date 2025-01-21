import { AppDataSource } from '../../../config/database';
import { CreatePromptDto } from '../../../dtos/Prompt/CreatePromptDto';
import { Prompt } from '../../../models/prompt';

export class CreatePromptCommand {
    private promptRepository = AppDataSource.getRepository(Prompt);

    async execute(createPromptDto: CreatePromptDto): Promise<Prompt> {
        const promptData = {
            ...createPromptDto,
            customerId: createPromptDto.customerId
        };
        const prompt = this.promptRepository.create(promptData);
        return await this.promptRepository.save(prompt);
    }
} 