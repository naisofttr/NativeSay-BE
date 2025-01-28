import { PromptServiceType } from "../../enums/PromptServiceType";

export interface CreatePromptDto {
    customerId: string;
    text: string;
    languageCode: string;
    servicePromptResponse: string;
    promptServiceType: PromptServiceType;
} 