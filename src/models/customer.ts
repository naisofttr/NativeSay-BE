import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MembershipType } from '../enums/MembershipType';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    profilePhotoUrl?: string | null;

    @Column({ type: 'varchar', nullable: true })
    refreshToken?: string;

    @Column({ type: 'timestamp', nullable: true })
    refreshTokenExpiryDate?: Date;

    @Column({ 
        type: 'enum',
        enum: MembershipType,
        default: MembershipType.FREE 
    })
    membershipType!: MembershipType;

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt?: Date | null;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt?: Date | null;
}

export interface CreatedCustomerResponse {
    success: boolean;
    data?: Customer;
    errorMessage?: string;
}