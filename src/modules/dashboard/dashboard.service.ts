import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { Sale } from '../../database/entities/sale.entity';
import { Product } from '../../database/entities/product.entity';
import { SaleItem } from '../../database/entities/sale-item.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Sale)
        private salesRepository: Repository<Sale>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(SaleItem)
        private saleItemsRepository: Repository<SaleItem>,
    ) { }

    async getStats(startDate?: string, endDate?: string) {
        try {
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date();

            // Only set end of day if NO endDate provided (default behavior)
            if (!endDate) {
                end.setHours(23, 59, 59, 999);
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const [
                totalSales,
                totalProducts,
                lowStockProducts,
                todaySales,
            ] = await Promise.all([
                this.salesRepository.count({
                    where: {
                        createdAt: Between(start, end),
                    }
                }),
                this.productsRepository.count({ where: { isActive: true } }),
                this.productsRepository.count({
                    where: {
                        isActive: true,
                        stock: LessThanOrEqual(10),
                    },
                }),
                this.salesRepository.count({
                    where: {
                        createdAt: MoreThanOrEqual(today),
                    },
                }),
            ]);

            const totalRevenue = await this.salesRepository
                .createQueryBuilder('sale')
                .select('SUM(sale.total)', 'total')
                .where('sale.createdAt BETWEEN :start AND :end', { start, end })
                .getRawOne();

            const todayRevenue = await this.salesRepository
                .createQueryBuilder('sale')
                .select('SUM(sale.total)', 'total')
                .where('sale.createdAt >= :today', { today })
                .getRawOne();

            return {
                totalSales,
                totalRevenue: parseFloat(totalRevenue?.total || '0'),
                totalProducts,
                lowStockProducts,
                todaySales,
                todayRevenue: parseFloat(todayRevenue?.total || '0'),
            };
        } catch (error) {
            console.error('Error en getStats:', error);
            throw new InternalServerErrorException(
                `Error al obtener estadísticas: ${error.message}`
            );
        }
    }

    async getSalesChart(startDate?: string, endDate?: string) {
        try {
            let start = startDate ? new Date(startDate) : new Date();
            let end = endDate ? new Date(endDate) : new Date();

            // Default to last 7 days if no dates provided
            if (!startDate || !endDate) {
                end = new Date(); // Reset to now
                start = new Date();
                start.setDate(end.getDate() - 7);
                end.setHours(23, 59, 59, 999);
            }

            const sales = await this.salesRepository
                .createQueryBuilder('sale')
                .select('DATE(sale.createdAt)', 'date')
                .addSelect('SUM(sale.total)', 'total')
                .where('sale.createdAt BETWEEN :start AND :end', { start, end })
                .groupBy('DATE(sale.createdAt)')
                .orderBy('DATE(sale.createdAt)', 'ASC')
                .getRawMany();

            const labels = sales.map((s) => {
                const d = new Date(s.date);
                // Fix timezone issue by adding timezone offset or using split
                // Simple approach: append T00:00:00 to treat as local or just use UTC string part
                return s.date instanceof Date ? s.date.toISOString().split('T')[0] : s.date;
            });
            const data = sales.map((s) => parseFloat(s.total));

            return { labels, data };
        } catch (error) {
            console.error('Error en getSalesChart:', error);
            throw new InternalServerErrorException(
                `Error al obtener gráfica de ventas: ${error.message}`
            );
        }
    }

    async getTopProducts(limit: number = 5, startDate?: string, endDate?: string) {
        try {
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date();
            if (!endDate) end.setHours(23, 59, 59, 999);

            const topProducts = await this.saleItemsRepository
                .createQueryBuilder('saleItem')
                .leftJoin('saleItem.product', 'product')
                .leftJoin('saleItem.sale', 'sale') // Need join to filter by date
                .where('sale.createdAt BETWEEN :start AND :end', { start, end })
                .select('product.id', 'id')
                .addSelect('product.name', 'name')
                .addSelect('SUM(saleItem.quantity)', 'totalSold')
                .addSelect('SUM(saleItem.quantity * saleItem.unitPrice)', 'revenue')
                .groupBy('product.id')
                .addGroupBy('product.name')
                .orderBy('SUM(saleItem.quantity)', 'DESC')
                .limit(limit)
                .getRawMany();

            return topProducts.map((p) => ({
                id: p.id,
                name: p.name,
                totalSold: parseInt(p.totalSold),
                revenue: parseFloat(p.revenue),
            }));
        } catch (error) {
            console.error('Error completo en getTopProducts:', JSON.stringify(error, null, 2));
            throw new InternalServerErrorException(
                error.message || 'Error al obtener productos más vendidos'
            );
        }
    }

    async getSalesByCategory(startDate?: string, endDate?: string) {
        try {
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date();
            if (!endDate) end.setHours(23, 59, 59, 999);

            const salesByCategory = await this.saleItemsRepository
                .createQueryBuilder('saleItem')
                .leftJoin('saleItem.product', 'product')
                .leftJoin('product.category', 'category')
                .leftJoin('saleItem.sale', 'sale')
                .where('sale.createdAt BETWEEN :start AND :end', { start, end })
                .select('category.name', 'category')
                .addSelect('SUM(saleItem.quantity * saleItem.unitPrice)', 'total')
                .andWhere('category.name IS NOT NULL')
                .groupBy('category.name')
                .getRawMany();

            const totalRevenue = salesByCategory.reduce(
                (sum, s) => sum + parseFloat(s.total),
                0,
            );

            return salesByCategory.map((s) => ({
                category: s.category || 'Sin categoría',
                total: parseFloat(s.total),
                percentage: totalRevenue > 0 ? ((parseFloat(s.total) / totalRevenue) * 100).toFixed(2) : '0',
            }));
        } catch (error) {
            console.error('Error completo en getSalesByCategory:', JSON.stringify(error, null, 2));
            throw new InternalServerErrorException(
                error.message || 'Error al obtener ventas por categoría'
            );
        }
    }

    async getRecentSales(limit: number = 10, startDate?: string, endDate?: string) {
        try {
            const where: any = {};

            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                // Trust frontend timestamp
                where.createdAt = Between(start, end);
            }

            const sales = await this.salesRepository.find({
                where,
                relations: ['customer', 'user', 'payments'],
                order: { createdAt: 'DESC' },
                take: limit,
            });

            return sales;
        } catch (error) {
            console.error('Error en getRecentSales:', error);
            throw new InternalServerErrorException(
                `Error al obtener ventas recientes: ${error.message}`
            );
        }
    }
}
