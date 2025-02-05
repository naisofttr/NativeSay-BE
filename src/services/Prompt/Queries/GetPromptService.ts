import axios from 'axios';
import { ChatGPTResponse } from '../../../dtos/ChatGPT/ChatGPTResponseDto';
import { PromptRequest } from '../../../dtos/Prompt/PromptRequestDto';
import { PromptResponse } from '../../../dtos/Prompt/PromptResponseDto';
import { GetPromptQuery } from './GetPromptQuery';
import { CreatePromptCommand } from '../Commands/CreatePromptCommand';
import { Request } from 'express';
import { extractCustomerIdFromToken } from '../../../utils/jwtUtils';
import { getDeepSeekPrompt } from '../../DeepSeekServices/getDeepSeekPrompt';
import { getChatGptPrompt } from '../../ChatGptServices/getChatGptPrompt';
import { PromptServiceType } from '../../../enums/PromptServiceType';
import { CreatePromptHistoryCommand } from '../Commands/CreatePromptHistoryCommand';

export class GetPromptService {
    private gptApiKey: string;
    private gptEndpoint: string;
    private deepApiKey: string;
    private deepEndpoint: string;
    private getPromptQuery: GetPromptQuery;
    private createPromptCommand: CreatePromptCommand;
    private createPromptHistoryCommand: CreatePromptHistoryCommand;

    constructor() {
        this.gptApiKey = process.env.OPENAI_API_KEY || '';
        this.gptEndpoint = process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
        this.deepApiKey = process.env.DEEPSEEK_API_KEY || '';
        this.deepEndpoint = process.env.DEEPSEEK_ENDPOINT || 'https://api.deepseek.com';
        this.getPromptQuery = new GetPromptQuery();
        this.createPromptCommand = new CreatePromptCommand();
        this.createPromptHistoryCommand = new CreatePromptHistoryCommand();
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

            let promptServiceType = PromptServiceType.DeepSeek;
            // DeepSeek API'sine istek at
            let response = await getDeepSeekPrompt(
               this.deepEndpoint,
               this.deepApiKey,
               request.languageCode,
               request.prompt
            );
            // Eğer sonuç dönmezse, ChatGpt API'sine istek at
            if (response === undefined){
                const responseChatGpt = await getChatGptPrompt(
                    this.gptEndpoint,
                    this.gptApiKey,
                    request.languageCode,
                    request.prompt
                );
                promptServiceType = PromptServiceType.ChatGpt;
                response = responseChatGpt;
            }

            if (response.choices && response.choices.length > 0) {
                const servicePromptResponse = response.choices[0].message.content;

                // CreatePromptCommand ile veritabanına kayıt yap
                const createdPrompt = await this.createPromptCommand.execute({
                    customerId: customerId,
                    text: request.prompt,
                    languageCode: request.languageCode,
                    servicePromptResponse: servicePromptResponse,
                    promptServiceType: promptServiceType
                });

                const createdPromptHistory = await this.createPromptHistoryCommand.execute({
                    promptId: createdPrompt.id,
                    customerId: customerId,
                    text: request.prompt,
                    servicePromptResponse: servicePromptResponse
                });

                return {
                    message: servicePromptResponse,
                    confirmedCount: 0
                };
            }

            throw new Error('No response from Prompt Service');

        } catch (error) {
            console.error('Prompt Service API Error:', error);
            return {
                message: '',
                error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
            };
        }
    }
}