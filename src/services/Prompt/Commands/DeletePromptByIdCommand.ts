import { AppDataSource } from '../../../config/database';
import { Prompt } from '../../../models/prompt';

export class DeletePromptByIdCommand {
    private promptRepository = AppDataSource.getRepository(Prompt);

    async execute(id: string): Promise<boolean> {
        try {
            const result = await this.promptRepository.delete(id);
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            throw new Error('Prompt silinirken bir hata oluştu');
        }
    }
}
