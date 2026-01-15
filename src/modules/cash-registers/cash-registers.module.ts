import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashRegistersService } from './cash-registers.service';
import { CashRegistersController } from './cash-registers.controller';
import { CashRegister } from '../../database/entities/cash-register.entity';
import { SalePayment } from '../../database/entities/sale-payment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CashRegister, SalePayment])],
    controllers: [CashRegistersController],
    providers: [CashRegistersService],
    exports: [CashRegistersService],
})
export class CashRegistersModule { }
