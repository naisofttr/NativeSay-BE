import { MembershipType } from "../../enums/MembershipType";

export interface UpdateCustomerDto {
    name?: string;
    profilePhotoUrl?: string;
    membershipType?: MembershipType;
    clientDate?: string | Date;
}
