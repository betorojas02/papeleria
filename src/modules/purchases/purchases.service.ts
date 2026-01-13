import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from '../../database/entities/purchase.entity';
import { PurchaseDetail } from '../../database/entities/purchase-detail.entity';
import { Product } from '../../database/entities/product.entity';
import { ResourceNotFoundException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectRepository(Purchase)
        private readonly purchasesRepository: Repository<Purchase>,
        @InjectRepository(PurchaseDetail)
        private readonly purchaseDetailsRepository: Repository<PurchaseDetail>,
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        private readonly dataSource: DataSource,
    ) { }

    async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Calcular total
            let total = 0;
            for (const detail of createPurchaseDto.details) {
                total += detail.quantity * detail.unitCost;
            }

            // Crear purchase
            const purchase = this.purchasesRepository.create({
                supplierId: createPurchaseDto.supplierId,
                userId: createPurchaseDto.userId,
                invoiceNumber: createPurchaseDto.invoiceNumber,
                total,
                purchaseDate: new Date(),
            });

            const savedPurchase = await queryRunner.manager.save(purchase);

            // Crear detalles y actualizar stock
            for (const detailDto of createPurchaseDto.details) {
                // Crear detalle
                const detail = this.purchaseDetailsRepository.create({
                    purchaseId: savedPurchase.id,
                    productId: detailDto.productId,
                    quantity: detailDto.quantity,
                    unitCost: detailDto.unitCost,
                    subtotal: detailDto.quantity * detailDto.unitCost,
                });

                await queryRunner.manager.save(detail);

                // Actualizar stock del producto
                await queryRunner.manager.increment(
                    Product,
                    { id: detailDto.productId },
                    'stock',
                    detailDto.quantity,
                );
            }

            await queryRunner.commitTransaction();

            // Retornar purchase con relaciones
            return this.findOne(savedPurchase.id);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<Purchase[]> {
        return this.purchasesRepository.find({
            relations: ['supplier', 'user', 'details', 'details.product'],
            order: { purchaseDate: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Purchase> {
        const purchase = await this.purchasesRepository.findOne({
            where: { id },
            relations: ['supplier', 'user', 'details', 'details.product'],
        });

        if (!purchase) {
            throw ResourceNotFoundException.model('Purchase', id);
        }

        return purchase;
    }

    async remove(id: string): Promise<void> {
        const purchase = await this.findOne(id);
        await this.purchasesRepository.softDelete(id);
    }
}
