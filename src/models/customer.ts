import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    name!: string;

    @Column({ name: 'profile_photo_url', nullable: true })
    profilePhotoUrl?: string;

    @Column({ name: 'id_token' })
    idToken!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    constructor(partial: Partial<Customer>) {
        Object.assign(this, partial);
    }
}

export interface CreateCustomerDto {
    IdToken: string;
    Email: string;
    Name: string;
    ProfilePhotoUrl?: string;
}

export interface CreatedCustomerResponse {
    success: boolean;
    data?: Customer;
    errorMessage?: string;
} 