import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id!: number;

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