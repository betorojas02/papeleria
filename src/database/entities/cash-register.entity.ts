import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Sale } from './sale.entity';

export enum CashRegisterStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

@Entity('cash_registers')
export class CashRegister extends BaseEntity {
    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'opening_amount' })
    openingAmount: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        name: 'closing_amount',
        nullable: true,
    })
    closingAmount: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        name: 'expected_amount',
        nullable: true,
    })
    expectedAmount: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    difference: number;

    @Column({ type: 'timestamp', name: 'opened_at' })
    openedAt: Date;

    @Column({ type: 'timestamp', name: 'closed_at', nullable: true })
    closedAt: Date;

    @Column({
        type: 'enum',
        enum: CashRegisterStatus,
        default: CashRegisterStatus.OPEN,
    })
    status: CashRegisterStatus;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToMany(() => Sale, (sale) => sale.cashRegister)
    sales: Sale[];
}
