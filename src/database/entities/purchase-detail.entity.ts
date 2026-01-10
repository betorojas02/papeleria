import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Purchase } from './purchase.entity';
import { Product } from './product.entity';

@Entity('purchase_details')
export class PurchaseDetail extends BaseEntity {
    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_cost' })
    unitCost: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @ManyToOne(() => Purchase, (purchase) => purchase.details, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'purchase_id' })
    purchase: Purchase;

    @Column({ name: 'purchase_id' })
    purchaseId: string;

    @ManyToOne(() => Product, (product) => product.purchaseDetails)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'product_id' })
    productId: string;
}
