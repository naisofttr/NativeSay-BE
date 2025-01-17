export interface TokenResponse {
    refreshToken: string;
    expireDate?: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
    clientDate: string;
    provider: 'google' | 'apple';
}

export interface AppleAuthResponse {
    id: string;
    email: string;
    name?: {
        firstName: string;
        lastName: string;
    };
}

export interface AppleTokenRequest {
    code: string;
    name?: {
        firstName: string;
        lastName: string;
    };
} 