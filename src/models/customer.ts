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

    @CreateDateColumn({ nullable: true })
    createdAt?: Date | null;

    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date | null;
}

export interface CreatedCustomerResponse {
    success: boolean;
    data?: Customer;
    errorMessage?: string;
} 