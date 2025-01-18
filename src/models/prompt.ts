import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer';

@Entity('prompts')
export class Prompt {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    customerId!: number;

    @Column()
    text!: string;

    @Column({ length: 50 })
    languageCode!: string;

    @Column()
    servicePromptResponse!: string;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customerId' })
    customer!: Customer;
}
