import { AppDataSource } from '../../../config/database';
import { Prompt } from '../../../models/prompt';

export class DeletePromptByServicePromptResponseCommand {
    private promptRepository = AppDataSource.getRepository(Prompt);

    async execute(servicePromptResponse: string): Promise<boolean> {
        try {
            const result = await this.promptRepository.delete({ servicePromptResponse });
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            throw new Error('Prompt silinirken bir hata oluştu');
        }
    }
}
