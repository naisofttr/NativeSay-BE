import { MembershipType } from '../../enums/MembershipType';

export interface CreateCustomerDto {
    Id?: string;
    IdToken: string;
    Email: string;
    Name: string;
    ProfilePhotoUrl?: string;
    ClientDate: string;
    MembershipType?: MembershipType;
}