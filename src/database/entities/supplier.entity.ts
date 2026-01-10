import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { Purchase } from './purchase.entity';

@Entity('suppliers')
export class Supplier extends BaseEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    contact: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true, type: 'text' })
    address: string;

    @Column({ nullable: true, name: 'tax_id' })
    taxId: string; // NIT

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @OneToMany(() => Product, (product) => product.supplier)
    products: Product[];

    @OneToMany(() => Purchase, (purchase) => purchase.supplier)
    purchases: Purchase[];
}
