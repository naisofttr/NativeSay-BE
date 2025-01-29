import { MembershipType } from '../enums/MembershipType';

export interface Customer {
    id: string;
    email: string;
    name: string;
    profilePhotoUrl?: string | null;
    refreshToken?: string;
    refreshTokenExpiryDate?: Date;
    membershipType: MembershipType;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatedCustomerResponse {
    success: boolean;
    data?: Customer;
    errorMessage?: string;
}