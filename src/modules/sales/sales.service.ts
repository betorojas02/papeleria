import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, ILike, Between, Brackets } from 'typeorm';
import { fromZonedTime } from 'date-fns-tz';
import { APP_TIMEZONE } from '../../common/constants/app.constants';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from '../../database/entities/sale.entity';
import { SaleItem } from '../../database/entities/sale-item.entity';
import { SalePayment } from '../../database/entities/sale-payment.entity';
import { Product } from '../../database/entities/product.entity';
import { ResourceNotFoundException, BusinessLogicException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale)
        private readonly salesRepository: Repository<Sale>,
        @InjectRepository(SaleItem)
        private readonly saleItemsRepository: Repository<SaleItem>,
        @InjectRepository(SalePayment)
        private readonly salePaymentsRepository: Repository<SalePayment>,
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        private readonly dataSource: DataSource,
    ) { }

    async create(createSaleDto: CreateSaleDto): Promise<Sale> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Calcular total
            let total = 0;
            for (const item of createSaleDto.items) {
                total += item.quantity * item.price;
            }

            // Validar que los pagos cubran el total
            const totalPaid = createSaleDto.payments.reduce((sum, payment) => sum + payment.amount, 0);
            if (totalPaid < total) {
                throw new BusinessLogicException(
                    `El total de pagos (${totalPaid}) no cubre el total de la venta (${total})`,
                );
            }

            // Crear sale
            const sale = this.salesRepository.create({
                customerId: createSaleDto.customerId,
                userId: createSaleDto.userId,
                cashRegisterId: createSaleDto.cashRegisterId,
                invoiceNumber: createSaleDto.invoiceNumber,
                total,
                taxAmount: createSaleDto.taxAmount || 0,
            });

            const savedSale = await queryRunner.manager.save(Sale, sale);

            // Crear items y reducir stock
            for (const itemDto of createSaleDto.items) {
                // Verificar stock disponible
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: itemDto.productId },
                });

                if (!product) {
                    throw ResourceNotFoundException.product(itemDto.productId);
                }

                if (product.stock < itemDto.quantity) {
                    throw new BusinessLogicException(
                        `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${itemDto.quantity}`,
                    );
                }

                // Crear item
                const item = this.saleItemsRepository.create({
                    saleId: savedSale.id,
                    productId: itemDto.productId,
                    quantity: itemDto.quantity,
                    unitPrice: itemDto.price,
                    subtotal: itemDto.quantity * itemDto.price,
                });

                await queryRunner.manager.save(SaleItem, item);

                // Reducir stock
                await queryRunner.manager.decrement(
                    Product,
                    { id: itemDto.productId },
                    'stock',
                    itemDto.quantity,
                );
            }

            // Crear pagos
            for (const paymentDto of createSaleDto.payments) {
                const payment = this.salePaymentsRepository.create({
                    saleId: savedSale.id,
                    paymentMethod: paymentDto.method,
                    amount: paymentDto.amount,
                    voucherNumber: paymentDto.voucherNumber,
                    referenceNumber: paymentDto.referenceNumber,
                });

                await queryRunner.manager.save(SalePayment, payment);
            }

            await queryRunner.commitTransaction();

            // Retornar sale con relaciones
            return this.findOne(savedSale.id);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(page: number = 1, limit: number = 10, search?: string, date?: string) {
        const take = limit || 10;
        const skip = (page - 1) * take;

        const query = this.salesRepository.createQueryBuilder('sale')
            .leftJoinAndSelect('sale.customer', 'customer')
            .leftJoinAndSelect('sale.user', 'user')
            .leftJoinAndSelect('sale.items', 'items')
            .leftJoinAndSelect('items.product', 'product')
            .leftJoinAndSelect('sale.payments', 'payments')
            .orderBy('sale.createdAt', 'DESC')
            .skip(skip)
            .take(take);

        if (date) {
            // "2026-01-14 00:00:00" in Bogota
            const startOfDayBogota = `${date} 00:00:00`;
            const startDateUtc = fromZonedTime(startOfDayBogota, APP_TIMEZONE);

            // "2026-01-14 23:59:59.999" in Bogota
            const endOfDayBogota = `${date} 23:59:59.999`;
            const endDateUtc = fromZonedTime(endOfDayBogota, APP_TIMEZONE);

            query.andWhere('sale.createdAt BETWEEN :start AND :end', { start: startDateUtc, end: endDateUtc });
        }

        if (search) {
            query.andWhere(new Brackets(qb => {
                qb.where('customer.firstName ILIKE :search', { search: `%${search}%` })
                    .orWhere('customer.lastName ILIKE :search', { search: `%${search}%` })
                    .orWhere('sale.id::text ILIKE :search', { search: `%${search}%` }); // Optional: Search by ID too
            }));
        }

        const [items, total] = await query.getManyAndCount();

        return {
            data: items,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / take),
            },
        };
    }

    async findOne(id: string): Promise<Sale> {
        const sale = await this.salesRepository.findOne({
            where: { id },
            relations: ['customer', 'user', 'items', 'items.product', 'payments'],
        });

        if (!sale) {
            throw ResourceNotFoundException.model('Sale', id);
        }

        return sale;
    }

    async remove(id: string): Promise<void> {
        const sale = await this.findOne(id);
        await this.salesRepository.softDelete(id);
    }
}
