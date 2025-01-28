import axios from "axios";

export const getDeepSeekPrompt = async (
    endpoint: string,
    apiKey: string,
    languageCode: string,
    prompt: string
): Promise<any> => {
    try {
        const response = await axios.post(endpoint, {
            text: prompt,
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
