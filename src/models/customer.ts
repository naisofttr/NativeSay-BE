import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    name!: string;

    @Column({ nullable: true, type: 'varchar', default: null })
    profilePhotoUrl?: string | null;

    @Column({ nullable: true })
    refreshToken?: string;

    @Column({ nullable: true })
    refreshTokenExpiryDate?: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

export interface CreateCustomerDto {
    IdToken: string;
    Email: string;
    Name: string;
    ProfilePhotoUrl?: string;
    clientDate: string;
}

export interface CreatedCustomerResponse {
    success: boolean;
    data?: Customer;
    errorMessage?: string;
    tokens?: TokenResponse;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
} 