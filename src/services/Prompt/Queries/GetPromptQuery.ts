import { AppDataSource } from '../../../config/database';
import { Prompt } from '../../../models/prompt';

export class GetPromptQuery {
    private promptRepository = AppDataSource.getRepository(Prompt);

    async execute(text: string, languageCode: string): Promise<Prompt | null> {
        return await this.promptRepository.findOne({
            where: {
                text: text,
                languageCode: languageCode
            },
            select: ['text', 'languageCode', 'servicePromptResponse']
        });
    }
} 