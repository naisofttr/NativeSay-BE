import axios from 'axios';
import { ChatGPTResponse } from '../../../dtos/ChatGPT/ChatGPTResponseDto';
import { PromptRequest } from '../../../dtos/Prompt/PromptRequestDto';
import { PromptResponse } from '../../../dtos/Prompt/PromptResponseDto';
import { GetPromptQuery } from './GetPromptQuery';
import { CreatePromptCommand } from '../Commands/CreatePromptCommand';
import { Request } from 'express';
import { extractCustomerIdFromToken } from '../../../utils/jwtUtils';
import { getChatGptPrompt } from '../../ChatGptServices/getChatGptPrompt';

export class GetPromptService {
    private apiKey: string;
    private endpoint: string;
    private getPromptQuery: GetPromptQuery;
    private createPromptCommand: CreatePromptCommand;

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || '';
        this.endpoint = process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
        this.getPromptQuery = new GetPromptQuery();
        this.createPromptCommand = new CreatePromptCommand();
    }

    async getPromptResponse(request: PromptRequest, req: Request): Promise<PromptResponse> {
        try {
            const customerId = extractCustomerIdFromToken(req);
            
            // GetPromptQuery ile veritabanı sorgusu yap
            const existingPrompt = await this.getPromptQuery.execute(request.prompt, request.languageCode);
            if (existingPrompt) {
                return {
                    message: existingPrompt.servicePromptResponse,
                    confirmedCount: existingPrompt.confirmedCount || 1
                };
            }

            // Eğer sonuç dönmezse, ChatGPT API'sine istek at
            const response = await getChatGptPrompt(
                this.endpoint,
                this.apiKey,
                request.languageCode,
                request.prompt
            );

            if (response.choices && response.choices.length > 0) {
                const servicePromptResponse = response.choices[0].message.content;

                // CreatePromptCommand ile veritabanına kayıt yap
                await this.createPromptCommand.execute({
                    customerId: customerId,
                    text: request.prompt,
                    languageCode: request.languageCode,
                    servicePromptResponse: servicePromptResponse
                });

                return {
                    message: servicePromptResponse,
                    confirmedCount: 1
                };
            }

            throw new Error('No response from ChatGPT');

        } catch (error) {
            console.error('ChatGPT API Error:', error);
            return {
                message: '',
                error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
            };
        }
    }
}