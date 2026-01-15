import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Sale } from './sale.entity';
import { Product } from './product.entity';
import { Service } from './service.entity';

@Entity('sale_items')
export class SaleItem extends BaseEntity {
    @Column({ type: 'varchar', length: 20, default: 'product' })
    itemType: 'product' | 'service';

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @Column({ name: 'sale_id' })
    saleId: string;

    @ManyToOne(() => Product, (product) => product.saleItems, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'product_id', nullable: true })
    productId: string;

    @ManyToOne(() => Service, { nullable: true })
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @Column({ name: 'service_id', nullable: true })
    serviceId: string;
}
