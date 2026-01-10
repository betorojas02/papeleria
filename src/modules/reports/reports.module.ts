import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from '../../database/entities/sale.entity';
import { SalePayment } from '../../database/entities/sale-payment.entity';
import { CashRegister } from '../../database/entities/cash-register.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Sale)
        private saleRepository: Repository<Sale>,
        @InjectRepository(SalePayment)
        private salePaymentRepository: Repository<SalePayment>,
        @InjectRepository(CashRegister)
        private cashRegisterRepository: Repository<CashRegister>,
    ) { }

    async getSalesByPaymentMethod(filters: any) {
        const dateFrom = filters.dateFrom || new Date(new Date().setDate(1));
        const dateTo = filters.dateTo || new Date();

        const query = this.salePaymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.sale', 'sale')
            .where('sale.createdAt BETWEEN :dateFrom AND :dateTo', {
                dateFrom,
                dateTo,
            });

        if (filters.paymentMethod) {
            query.andWhere('payment.paymentMethod = :method', {
                method: filters.paymentMethod,
            });
        }

        const payments = await query.getMany();

        // Agrupar por método de pago
        const byMethod = payments.reduce((acc, payment) => {
            const method = payment.paymentMethod;
            if (!acc[method]) {
                acc[method] = {
                    method,
                    total_amount: 0,
                    transaction_count: 0,
                    voucher_count: 0,
                };
            }
            acc[method].total_amount += Number(payment.amount);
            acc[method].transaction_count += 1;
            if (payment.voucherNumber) {
                acc[method].voucher_count += 1;
            }
            return acc;
        }, {});

        const totalAmount = Object.values(byMethod).reduce(
            (sum: number, item: any) => sum + item.total_amount,
            0,
        );

        // Calcular porcentajes
        Object.values(byMethod).forEach((item: any) => {
            item.percentage = ((item.total_amount / totalAmount) * 100).toFixed(2);
        });

        return {
            period: { from: dateFrom, to: dateTo },
            summary: {
                total_sales: totalAmount,
                total_transactions: payments.length,
            },
            by_method: Object.values(byMethod),
        };
    }

    async getMixedPaymentSales(filters: any) {
        const dateFrom = filters.dateFrom || new Date(new Date().setDate(1));
        const dateTo = filters.dateTo || new Date();

        const sales = await this.saleRepository
            .createQueryBuilder('sale')
            .leftJoinAndSelect('sale.payments', 'payments')
            .where('sale.createdAt BETWEEN :dateFrom AND :dateTo', {
                dateFrom,
                dateTo,
            })
            .getMany();

        // Filtrar solo ventas con múltiples pagos
        const mixedSales = sales
            .filter((sale) => sale.payments && sale.payments.length > 1)
            .map((sale) => ({
                sale_id: sale.id,
                invoice_number: sale.invoiceNumber,
                total: sale.total,
                date: sale.createdAt,
                payment_count: sale.payments.length,
                payments: sale.payments.map((p) => ({
                    method: p.paymentMethod,
                    amount: p.amount,
                    voucher: p.voucherNumber,
                })),
            }));

        return {
            mixed_payment_sales: mixedSales,
            count: mixedSales.length,
        };
    }

    async getVouchers(filters: any) {
        const dateFrom = filters.dateFrom || new Date(new Date().setDate(1));
        const dateTo = filters.dateTo || new Date();

        const query = this.salePaymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.sale', 'sale')
            .where('payment.voucherNumber IS NOT NULL')
            .andWhere('sale.createdAt BETWEEN :dateFrom AND :dateTo', {
                dateFrom,
                dateTo,
            });

        if (filters.paymentMethod) {
            query.andWhere('payment.paymentMethod = :method', {
                method: filters.paymentMethod,
            });
        }

        const payments = await query.getMany();

        const vouchers = payments.map((payment) => ({
            voucher_number: payment.voucherNumber,
            payment_method: payment.paymentMethod,
            amount: payment.amount,
            sale_id: payment.saleId,
            invoice_number: payment.sale?.invoiceNumber,
            date: payment.createdAt,
            reference_number: payment.referenceNumber,
            notes: payment.notes,
        }));

        return {
            vouchers,
            count: vouchers.length,
            total_amount: vouchers.reduce((sum, v) => sum + Number(v.amount), 0),
        };
    }

    async getCashRegisterDetail(id: string) {
        const cashRegister = await this.cashRegisterRepository.findOne({
            where: { id },
            relations: ['sales', 'sales.payments'],
        });

        if (!cashRegister) {
            throw new Error('Cash register not found');
        }

        // Desglose por método de pago
        const paymentBreakdown = {};
        cashRegister.sales.forEach((sale) => {
            sale.payments?.forEach((payment) => {
                const method = payment.paymentMethod;
                if (!paymentBreakdown[method]) {
                    paymentBreakdown[method] = {
                        method,
                        count: 0,
                        total: 0,
                        vouchers: [],
                    };
                }
                paymentBreakdown[method].count += 1;
                paymentBreakdown[method].total += Number(payment.amount);
                if (payment.voucherNumber) {
                    paymentBreakdown[method].vouchers.push(payment.voucherNumber);
                }
            });
        });

        return {
            cash_register_id: cashRegister.id,
            opened_at: cashRegister.openedAt,
            closed_at: cashRegister.closedAt,
            opening_amount: cashRegister.openingAmount,
            closing_amount: cashRegister.closingAmount,
            expected_amount: cashRegister.expectedAmount,
            difference: cashRegister.difference,
            sales_count: cashRegister.sales.length,
            payment_breakdown: Object.values(paymentBreakdown),
        };
    }

    async getDailySales(date?: string) {
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const sales = await this.saleRepository.find({
            where: {
                createdAt: Between(startOfDay, endOfDay),
            },
            relations: ['payments', 'items'],
        });

        const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        const totalTransactions = sales.length;

        // Desglose por método de pago
        const paymentBreakdown = {};
        sales.forEach((sale) => {
            sale.payments?.forEach((payment) => {
                const method = payment.paymentMethod;
                if (!paymentBreakdown[method]) {
                    paymentBreakdown[method] = { method, total: 0, count: 0 };
                }
                paymentBreakdown[method].total += Number(payment.amount);
                paymentBreakdown[method].count += 1;
            });
        });

        return {
            date: targetDate.toISOString().split('T')[0],
            summary: {
                total_sales: totalSales,
                total_transactions: totalTransactions,
                average_ticket: totalTransactions > 0 ? totalSales / totalTransactions : 0,
            },
            payment_breakdown: Object.values(paymentBreakdown),
            sales,
        };
    }
}
