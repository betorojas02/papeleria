import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Obtener estadísticas del dashboard' })
    async getStats() {
        const stats = await this.dashboardService.getStats();
        return ApiResponse.success(stats, 'Estadísticas obtenidas exitosamente');
    }

    @Get('sales-chart')
    @ApiOperation({ summary: 'Obtener datos de gráfica de ventas' })
    @ApiQuery({ name: 'period', enum: ['week', 'month', 'year'], required: false })
    async getSalesChart(@Query('period') period: 'week' | 'month' | 'year') {
        const chartData = await this.dashboardService.getSalesChart(period || 'week');
        return ApiResponse.success(chartData, 'Datos de gráfica obtenidos exitosamente');
    }

    @Get('top-products')
    @ApiOperation({ summary: 'Obtener productos más vendidos' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async getTopProducts(@Query('limit') limit: string) {
        const topProducts = await this.dashboardService.getTopProducts(
            parseInt(limit) || 5,
        );
        return ApiResponse.success(topProducts, 'Productos más vendidos obtenidos exitosamente');
    }

    @Get('sales-by-category')
    @ApiOperation({ summary: 'Obtener ventas por categoría' })
    async getSalesByCategory() {
        const salesByCategory = await this.dashboardService.getSalesByCategory();
        return ApiResponse.success(
            salesByCategory,
            'Ventas por categoría obtenidas exitosamente',
        );
    }

    @Get('recent-sales')
    @ApiOperation({ summary: 'Obtener ventas recientes' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async getRecentSales(@Query('limit') limit: string) {
        const recentSales = await this.dashboardService.getRecentSales(
            parseInt(limit) || 10,
        );
        return ApiResponse.success(recentSales, 'Ventas recientes obtenidas exitosamente');
    }
}
