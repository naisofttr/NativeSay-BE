export const generatePromptContent = (languageCode: string, prompt: string): string => {
    return `In ${languageCode} language explanation for the '${prompt}'?(max.50char)`;
};
