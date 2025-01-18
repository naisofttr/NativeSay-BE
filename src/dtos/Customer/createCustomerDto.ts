export interface CreateCustomerDto {
    IdToken: string;
    Email: string;
    Name: string;
    ProfilePhotoUrl?: string;
    ClientDate: Date;
} 