import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer';

@Entity('prompts')
export class Prompt {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'integer' })
    customerId!: number;

    @Column({ type: 'text' })
    text!: string;

    @Column({ type: 'varchar', length: 50 })
    languageCode!: string;

    @Column({ type: 'text' })
    servicePromptResponse!: string;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customerId' })
    customer!: Customer;
}
