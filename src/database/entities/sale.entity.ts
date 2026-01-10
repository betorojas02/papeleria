import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Customer } from './customer.entity';
import { CashRegister } from './cash-register.entity';
import { SaleItem } from './sale-item.entity';
import { SalePayment } from './sale-payment.entity';

export enum SaleStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('sales')
export class Sale extends BaseEntity {
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'tax_amount', default: 0 })
    taxAmount: number;

    @Column({
        type: 'enum',
        enum: SaleStatus,
        default: SaleStatus.COMPLETED,
    })
    status: SaleStatus;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @Column({ nullable: true, name: 'invoice_number' })
    invoiceNumber: string;

    @ManyToOne(() => User, (user) => user.sales)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => Customer, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ name: 'customer_id', nullable: true })
    customerId: string;

    @ManyToOne(() => CashRegister, (cashRegister) => cashRegister.sales, {
        nullable: true,
    })
    @JoinColumn({ name: 'cash_register_id' })
    cashRegister: CashRegister;

    @Column({ name: 'cash_register_id', nullable: true })
    cashRegisterId: string;

    @OneToMany(() => SaleItem, (saleItem) => saleItem.sale, { cascade: true })
    items: SaleItem[];

    @OneToMany(() => SalePayment, (payment) => payment.sale, { cascade: true })
    payments: SalePayment[];
}
