export interface PromptHistory {
    id: string;
    promptId: string;
    customerId: string;
    text: string;
    servicePromptResponse: string;
    createdAt?: string;
    updatedAt?: Date | null;
}
