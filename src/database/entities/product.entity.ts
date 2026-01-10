import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { Supplier } from './supplier.entity';
import { Brand } from './brand.entity';
import { SaleItem } from './sale-item.entity';
import { PurchaseDetail } from './purchase-detail.entity';

export enum ProductType {
    PHYSICAL = 'physical', // Productos físicos con stock
    SERVICE = 'service', // Servicios (fotocopias, impresiones)
}

@Entity('products')
export class Product extends BaseEntity {
    @Column()
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    cost: number;

    @Column({ default: 0 })
    stock: number;

    @Column({ name: 'min_stock', default: 10 })
    minStock: number;

    @Column({ nullable: true, unique: true })
    barcode: string;

    @Column({ nullable: true })
    sku: string;

    @Column({
        type: 'enum',
        enum: ProductType,
        default: ProductType.PHYSICAL,
    })
    type: ProductType;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'category_id' })
    categoryId: string;

    @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true })
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @Column({ name: 'brand_id', nullable: true })
    brandId: string;

    @ManyToOne(() => Supplier, (supplier) => supplier.products, {
        nullable: true,
    })
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column({ name: 'supplier_id', nullable: true })
    supplierId: string;

    @OneToMany(() => SaleItem, (saleItem) => saleItem.product)
    saleItems: SaleItem[];

    @OneToMany(() => PurchaseDetail, (detail) => detail.product)
    purchaseDetails: PurchaseDetail[];
}
