import { AppDataSource } from '../../../config/database';
import { CreatePromptDto } from '../../../dtos/Prompt/CreatePromptDto';
import { Prompt } from '../../../models/prompt';

export class CreatePromptCommand {
    private promptRepository = AppDataSource.getRepository(Prompt);

    async execute(createPromptDto: CreatePromptDto): Promise<Prompt> {
        const prompt = this.promptRepository.create(createPromptDto);
        return await this.promptRepository.save(prompt);
    }
} 