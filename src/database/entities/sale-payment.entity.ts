import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Sale } from './sale.entity';

export enum PaymentMethod {
    CASH = 'cash', // Efectivo
    TRANSFER = 'transfer', // Transferencia
    CARD = 'card', // Datáfono/Tarjeta
    NEQUI = 'nequi',
    DAVIPLATA = 'daviplata',
}

@Entity('sale_payments')
export class SalePayment extends BaseEntity {
    @Column({
        type: 'enum',
        enum: PaymentMethod,
        name: 'payment_method',
    })
    paymentMethod: PaymentMethod;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true, name: 'voucher_number' })
    voucherNumber: string;

    @Column({ nullable: true, name: 'reference_number' })
    referenceNumber: string;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @ManyToOne(() => Sale, (sale) => sale.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @Column({ name: 'sale_id' })
    saleId: string;
}
