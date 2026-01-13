import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { Purchase } from '../../database/entities/purchase.entity';
import { PurchaseDetail } from '../../database/entities/purchase-detail.entity';
import { Product } from '../../database/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Purchase, PurchaseDetail, Product])],
    controllers: [PurchasesController],
    providers: [PurchasesService],
    exports: [PurchasesService],
})
export class PurchasesModule { }
