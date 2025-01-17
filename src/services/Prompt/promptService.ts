import axios from 'axios';
import { ChatGPTResponse, PromptRequest, PromptResponse } from '../../models/prompt';

export class PromptService {
    private apiKey: string;
    private endpoint: string;

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || '';
        this.endpoint = process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
    }

    async getPromptResponse(request: PromptRequest): Promise<PromptResponse> {
        try {
            const response = await axios.post<ChatGPTResponse>(
                this.endpoint,
                {
                    model: "gpt-3.5-turbo",// 3.5-turbo veya "gpt-4"
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
                return {
                    message: response.data.choices[0].message.content
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