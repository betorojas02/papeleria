import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Sale } from '../../database/entities/sale.entity';
import { Product } from '../../database/entities/product.entity';
import { SaleItem } from '../../database/entities/sale-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Product, SaleItem])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
