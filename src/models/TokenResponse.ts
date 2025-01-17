export interface TokenResponse {
    success: boolean;
    refreshToken?: string;
    expiresIn?: number;
    userData?: any;
    errorMessage?: string;
}