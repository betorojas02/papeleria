import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('sales-by-payment-method')
    @ApiOperation({ summary: 'Reporte de ventas por método de pago' })
    @ApiQuery({ name: 'date_from', required: false })
    @ApiQuery({ name: 'date_to', required: false })
    @ApiQuery({ name: 'payment_method', required: false })
    async salesByPaymentMethod(
        @Query('date_from') dateFrom?: string,
        @Query('date_to') dateTo?: string,
        @Query('payment_method') paymentMethod?: string,
    ) {
        return this.reportsService.getSalesByPaymentMethod({
            dateFrom,
            dateTo,
            paymentMethod,
        });
    }

    @Get('mixed-payment-sales')
    @ApiOperation({ summary: 'Reporte de ventas con pagos mixtos' })
    @ApiQuery({ name: 'date_from', required: false })
    @ApiQuery({ name: 'date_to', required: false })
    async mixedPaymentSales(
        @Query('date_from') dateFrom?: string,
        @Query('date_to') dateTo?: string,
    ) {
        return this.reportsService.getMixedPaymentSales({ dateFrom, dateTo });
    }

    @Get('vouchers')
    @ApiOperation({ summary: 'Reporte de comprobantes/vouchers' })
    @ApiQuery({ name: 'date_from', required: false })
    @ApiQuery({ name: 'date_to', required: false })
    @ApiQuery({ name: 'payment_method', required: false })
    async vouchers(
        @Query('date_from') dateFrom?: string,
        @Query('date_to') dateTo?: string,
        @Query('payment_method') paymentMethod?: string,
    ) {
        return this.reportsService.getVouchers({ dateFrom, dateTo, paymentMethod });
    }

    @Get('cash-register-detail/:id')
    @ApiOperation({ summary: 'Detalle de arqueo de caja con desglose de pagos' })
    async cashRegisterDetail(@Query('id') id: string) {
        return this.reportsService.getCashRegisterDetail(id);
    }

    @Get('daily-sales')
    @ApiOperation({ summary: 'Reporte de ventas diarias' })
    @ApiQuery({ name: 'date', required: false })
    async dailySales(@Query('date') date?: string) {
        return this.reportsService.getDailySales(date);
    }
}
