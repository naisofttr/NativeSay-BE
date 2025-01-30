import axios from "axios";
import { generatePromptContent } from "../../utils/promptContentGenerator";

export const getDeepSeekPrompt = async (
    endpoint: string,
    apiKey: string,
    languageCode: string,
    prompt: string
): Promise<any> => {
    try {
        const generatedPrompt = generatePromptContent(languageCode, prompt);
        const response = await axios.post(endpoint, {
            text: generatedPrompt,
            target_language: languageCode,
            max_characters: 50 // 50 karakter ile sınırlı
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // API'den gelen yanıtı işle
        // const translation = response.data.translation;
        // const explanation = response.data.explanation;
        // const description = response.data.description;

        return response.data;
    } catch (error) {
        console.error('Error fetching DeepSeek prompt:', error);
        // throw error;
    }
};
