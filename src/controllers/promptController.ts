import { Request, Response } from 'express';
import { GetPromptService } from '../services/Prompt/Queries/GetPromptService';
import { PromptRequest } from '../dtos/Prompt/PromptRequestDto';
import { DeletePromptByServicePromptResponseCommand } from '../services/Prompt/Commands/DeletePromptByServicePromptResponseCommand';
import { GetCustomerPromptsQuery } from '../services/Prompt/Queries/GetCustomerPromptsQuery';
import { UpdatePromptConfirmedCountCommand } from '../services/Prompt/Commands/UpdatePromptConfirmedCountCommand';
import { extractCustomerIdFromToken } from '../utils/jwtUtils';

export class PromptController {
    private promptService: GetPromptService;
    private deletePromptCommand: DeletePromptByServicePromptResponseCommand;
    private getCustomerPromptsQuery: GetCustomerPromptsQuery;
    private updatePromptConfirmedCountCommand: UpdatePromptConfirmedCountCommand;

    constructor() {
        this.promptService = new GetPromptService();
        this.deletePromptCommand = new DeletePromptByServicePromptResponseCommand();
        this.getCustomerPromptsQuery = new GetCustomerPromptsQuery();
        this.updatePromptConfirmedCountCommand = new UpdatePromptConfirmedCountCommand();
    }

    async getPrompt(req: Request, res: Response) {
        try {
            const promptRequest: PromptRequest = {
                prompt: req.body.prompt,
                languageCode: req.body.languageCode
            };

            if (!promptRequest.prompt || !promptRequest.languageCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Prompt ve languageCode zorunlu alanlardır'
                });
            }

            const response = await this.promptService.getPromptResponse(promptRequest, req);

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

    async getCustomerPrompts(req: Request, res: Response) {
        try {
            const customerId = extractCustomerIdFromToken(req);
            const prompts = await this.getCustomerPromptsQuery.execute(customerId);
            res.status(200).json(prompts);
        } catch (error) {
            console.error('Müşteri promptları getirme hatası:', error);
            res.status(500).json({ 
                error: 'Müşteri promptları getirilirken bir hata oluştu',
                details: error instanceof Error ? error.message : 'Bilinmeyen hata'
            });
        }
    }

    async updatePromptConfirmedCount(req: Request, res: Response) {
        try {
            const { servicePromptResponse, confirmedCount } = req.body;

            if (!servicePromptResponse || confirmedCount === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'servicePromptResponse ve confirmedCount zorunlu alanlardır'
                });
            }

            await this.updatePromptConfirmedCountCommand.execute({
                servicePromptResponse,
                confirmedCount
            });

            return res.status(200).json({
                success: true,
                message: 'Prompt confirmed count başarıyla güncellendi'
            });

        } catch (error) {
            console.error('UpdatePromptConfirmedCount error:', error);
            return res.status(500).json({
                success: false,
                message: 'Prompt confirmed count güncellenirken bir hata oluştu',
                error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
            });
        }
    }
}