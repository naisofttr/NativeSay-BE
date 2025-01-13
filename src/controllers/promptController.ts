import { Request, Response } from 'express';
import { PromptService } from '../services/promptService';
import { PromptRequest } from '../models/prompt';

export class PromptController {
    private promptService: PromptService;

    constructor() {
        this.promptService = new PromptService();
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
} 