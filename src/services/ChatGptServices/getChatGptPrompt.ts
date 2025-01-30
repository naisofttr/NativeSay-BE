import axios from 'axios';
import { ChatGPTResponse } from '../../dtos/ChatGPT/ChatGPTResponseDto';
import { generatePromptContent } from '../../utils/promptContentGenerator';

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
                    content: generatePromptContent(languageCode, prompt)
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
