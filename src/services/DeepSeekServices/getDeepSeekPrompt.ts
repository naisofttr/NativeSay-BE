import axios from "axios";
import { generatePromptContent } from "../../utils/promptContentGenerator";
import OpenAI from "openai";


export const getDeepSeekPrompt = async (
    endpoint: string,
    apiKey: string,
    languageCode: string,
    prompt: string
): Promise<any> => {
    try {
        const generatedPrompt = generatePromptContent(languageCode, prompt);
        const openai = new OpenAI({
            baseURL: endpoint,
            apiKey: apiKey
        });
        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: generatedPrompt }],
            model: "deepseek-chat",
        });

        return response;
    } catch (error) {
        console.error('Error fetching DeepSeek prompt:', error);
        // throw error;
    }
};
