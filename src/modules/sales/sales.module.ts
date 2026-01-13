import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from '../../database/entities/sale.entity';
import { SaleItem } from '../../database/entities/sale-item.entity';
import { SalePayment } from '../../database/entities/sale-payment.entity';
import { Product } from '../../database/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Sale, SaleItem, SalePayment, Product])],
    controllers: [SalesController],
    providers: [SalesService],
    exports: [SalesService],
})
export class SalesModule { }
