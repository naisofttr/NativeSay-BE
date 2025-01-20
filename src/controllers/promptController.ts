import { Request, Response } from 'express';
import { GetPromptService } from '../services/Prompt/Queries/GetPromptService';
import { PromptRequest } from '../dtos/Prompt/PromptRequestDto';
import { DeletePromptByServicePromptResponseCommand } from '../services/Prompt/Commands/DeletePromptByServicePromptResponseCommand';

export class PromptController {
    private promptService: GetPromptService;
    private deletePromptCommand: DeletePromptByServicePromptResponseCommand;

    constructor() {
        this.promptService = new GetPromptService();
        this.deletePromptCommand = new DeletePromptByServicePromptResponseCommand();
    }

    async getPrompt(req: Request, res: Response) {
        try {
            const promptRequest: PromptRequest = {
                prompt: req.body.prompt,
                languageCode: req.body.languageCode,
                customerId: req.body.customerId
            };

            if (!promptRequest.prompt || !promptRequest.languageCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Prompt ve languageCode zorunlu alanlardır'
                });
            }

            const response = await this.promptService.getPromptResponse(promptRequest);

            if (response.error) {
                return res.status(500).json({
                    success: false,
                    message: response.error
                });
            }

            return res.status(200).json({
                success: true,
                data: response
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
            });
        }
    }

    async deletePromptByServicePromptResponse(req: Request, res: Response) {
        try {
            const { servicePromptResponse } = req.body;

            if (!servicePromptResponse) {
                return res.status(400).json({
                    success: false,
                    message: 'servicePromptResponse parametresi zorunludur'
                });
            }

            const isDeleted = await this.deletePromptCommand.execute(servicePromptResponse);

            if (!isDeleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Silinecek prompt bulunamadı'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Prompt başarıyla silindi'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Prompt silinirken bir hata oluştu'
            });
        }
    }
}