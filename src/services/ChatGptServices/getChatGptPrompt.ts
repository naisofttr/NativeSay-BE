import axios from 'axios';
import { ChatGPTResponse } from '../../dtos/ChatGPT/ChatGPTResponseDto';

export const getChatGptPrompt = async (
    endpoint: string,
    apiKey: string,
    languageCode: string,
    prompt: string
): Promise<ChatGPTResponse> => {
    const response = await axios.post<ChatGPTResponse>(
        endpoint,
        {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `In ${languageCode} language explanation for the '${prompt}'?(max.50char)`
                }
            ],
            max_tokens: 100,
            temperature: 0.7
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );
    
    return response.data;
}
