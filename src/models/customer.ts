import { MembershipType } from '../enums/MembershipType';

export interface Customer {
    id: string;
    email: string;
    name: string;
    profilePhotoUrl?: string | null;
    refreshToken?: string;
    refreshTokenExpiryDate?: Date;
    membershipType: MembershipType;
    createdAt?: Date;
    updatedAt?: Date | null;
}

export interface CreatedCustomerResponse {
    success: boolean;
    data?: Customer;
    errorMessage?: string;
}