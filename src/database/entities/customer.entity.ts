import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('customers')
export class Customer extends BaseEntity {
    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ nullable: true, unique: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true, type: 'text' })
    address: string;

    @Column({ nullable: true, name: 'document_number' })
    documentNumber: string;

    @Column({ nullable: true, name: 'document_type' })
    documentType: string; // CC, NIT, CE, etc.

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;
}
