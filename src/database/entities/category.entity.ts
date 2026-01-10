import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity('categories')
export class Category extends BaseEntity {
    @Column()
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
