import { PromptServiceType } from "../enums/PromptServiceType";

export interface Prompt {
    id: string;
    customerId: string;
    text: string;
    languageCode: string;
    servicePromptResponse: string;
    confirmedCount: number;
    promptServiceType: PromptServiceType;
}
