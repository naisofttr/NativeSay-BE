import { MembershipType } from '../../enums/MembershipType';
import { Platform } from '../../enums/Platform';

export interface CreateCustomerDto {
    Id?: string;
    IdToken: string;
    Email: string;
    Name: string;
    ProfilePhotoUrl?: string;
    ClientDate: string;
    MembershipType?: MembershipType;
    Platform: Platform;
}