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
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async getStats(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const stats = await this.dashboardService.getStats(startDate, endDate);
        return ApiResponse.success(stats, 'Estadísticas obtenidas exitosamente');
    }

    @Get('sales-chart')
    @ApiOperation({ summary: 'Obtener datos de gráfica de ventas' })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async getSalesChart(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const chartData = await this.dashboardService.getSalesChart(startDate, endDate);
        return ApiResponse.success(chartData, 'Datos de gráfica obtenidos exitosamente');
    }

    @Get('top-products')
    @ApiOperation({ summary: 'Obtener productos más vendidos' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async getTopProducts(
        @Query('limit') limit: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const topProducts = await this.dashboardService.getTopProducts(
            parseInt(limit) || 5,
            startDate,
            endDate
        );
        return ApiResponse.success(topProducts, 'Productos más vendidos obtenidos exitosamente');
    }

    @Get('sales-by-category')
    @ApiOperation({ summary: 'Obtener ventas por categoría' })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async getSalesByCategory(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const salesByCategory = await this.dashboardService.getSalesByCategory(startDate, endDate);
        return ApiResponse.success(
            salesByCategory,
            'Ventas por categoría obtenidas exitosamente',
        );
    }

    @Get('recent-sales')
    @ApiOperation({ summary: 'Obtener ventas recientes' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async getRecentSales(
        @Query('limit') limit: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const recentSales = await this.dashboardService.getRecentSales(
            parseInt(limit) || 10,
            startDate,
            endDate
        );
        return ApiResponse.success(recentSales, 'Ventas recientes obtenidas exitosamente');
    }

    @Get('top-items')
    @ApiOperation({ summary: 'Obtener items más vendidos (productos y servicios)' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async getTopItems(
        @Query('limit') limit: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const topItems = await this.dashboardService.getTopItems(
            parseInt(limit) || 10,
            startDate,
            endDate
        );
        return ApiResponse.success(topItems, 'Items más vendidos obtenidos exitosamente');
    }

    @Get('items-breakdown')
    @ApiOperation({ summary: 'Obtener desglose de ingresos por tipo (productos vs servicios)' })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async getItemsBreakdown(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const breakdown = await this.dashboardService.getItemsBreakdown(startDate, endDate);
        return ApiResponse.success(breakdown, 'Desglose de items obtenido exitosamente');
    }
}
