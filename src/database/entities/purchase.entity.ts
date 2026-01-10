import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Supplier } from './supplier.entity';
import { PurchaseDetail } from './purchase-detail.entity';
import { User } from './user.entity';

export enum PurchaseStatus {
    PENDING = 'pending',
    RECEIVED = 'received',
    CANCELLED = 'cancelled',
}

@Entity('purchases')
export class Purchase extends BaseEntity {
    @Column({ name: 'invoice_number', nullable: true })
    invoiceNumber: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({
        type: 'enum',
        enum: PurchaseStatus,
        default: PurchaseStatus.PENDING,
    })
    status: PurchaseStatus;

    @Column({ type: 'date', name: 'purchase_date' })
    purchaseDate: Date;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @ManyToOne(() => Supplier, (supplier) => supplier.purchases)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column({ name: 'supplier_id' })
    supplierId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToMany(() => PurchaseDetail, (detail) => detail.purchase, {
        cascade: true,
    })
    details: PurchaseDetail[];
}
