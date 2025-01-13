export interface PromptRequest {
    prompt: string;
    languageCode: string;
}

export interface PromptResponse {
    message: string;
    error?: string;
}

interface ChatGPTMessage {
    role: string;
    content: string;
}

interface ChatGPTChoice {
    message: {
        content: string;
    };
}

export interface ChatGPTResponse {
    choices: ChatGPTChoice[];
} 