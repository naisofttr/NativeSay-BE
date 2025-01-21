import axios from 'axios';
import { ChatGPTResponse } from '../../../dtos/ChatGPT/ChatGPTResponseDto';
import { PromptRequest } from '../../../dtos/Prompt/PromptRequestDto';
import { PromptResponse } from '../../../dtos/Prompt/PromptResponseDto';
import { GetPromptQuery } from './GetPromptQuery';
import { CreatePromptCommand } from '../Commands/CreatePromptCommand';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new Error('Authorization header geçersiz veya eksik');
            }

            const token = authHeader.split(' ')[1];
            const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
            const jwtDecode = jwt.verify(token, secretKey) as JwtPayload;
            const customerId = jwtDecode.id;
            
            // GetPromptQuery ile veritabanı sorgusu yap
            const existingPrompt = await this.getPromptQuery.execute(request.prompt, request.languageCode);
            if (existingPrompt) {
                return {
                    message: existingPrompt.servicePromptResponse
                };
            }

            // Eğer sonuç dönmezse, ChatGPT API'sine istek at
            const response = await axios.post<ChatGPTResponse>(
                this.endpoint,
                {
                    model: "gpt-3.5-turbo", // 3.5-turbo veya "gpt-4"
                    messages: [
                        {
                            role: "user",
                            content: `In ${request.languageCode} language explanation for the '${request.prompt}'?(max.50char)`
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.7
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.choices && response.data.choices.length > 0) {
                const servicePromptResponse = response.data.choices[0].message.content;

                // CreatePromptCommand ile veritabanına kayıt yap
                await this.createPromptCommand.execute({
                    customerId: customerId,
                    text: request.prompt,
                    languageCode: request.languageCode,
                    servicePromptResponse: servicePromptResponse
                });

                return {
                    message: servicePromptResponse
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