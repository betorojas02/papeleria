import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
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

    async getStats() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const [
                totalSales,
                totalProducts,
                lowStockProducts,
                todaySales,
            ] = await Promise.all([
                this.salesRepository.count(),
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

    async getSalesChart(period: 'week' | 'month' | 'year' = 'week') {
        try {
            const now = new Date();
            let startDate = new Date();

            if (period === 'week') {
                startDate.setDate(now.getDate() - 7);
            } else if (period === 'month') {
                startDate.setMonth(now.getMonth() - 1);
            } else if (period === 'year') {
                startDate.setFullYear(now.getFullYear() - 1);
            }

            const sales = await this.salesRepository
                .createQueryBuilder('sale')
                .select('DATE(sale.createdAt)', 'date')
                .addSelect('SUM(sale.total)', 'total')
                .where('sale.createdAt >= :startDate', { startDate })
                .groupBy('DATE(sale.createdAt)')
                .orderBy('DATE(sale.createdAt)', 'ASC')
                .getRawMany();

            const labels = sales.map((s) => s.date);
            const data = sales.map((s) => parseFloat(s.total));

            return { labels, data };
        } catch (error) {
            console.error('Error en getSalesChart:', error);
            throw new InternalServerErrorException(
                `Error al obtener gráfica de ventas: ${error.message}`
            );
        }
    }

    async getTopProducts(limit: number = 5) {
        try {
            const topProducts = await this.saleItemsRepository
                .createQueryBuilder('saleItem')
                .leftJoin('saleItem.product', 'product')
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
            console.error('Stack:', error.stack);
            throw new InternalServerErrorException(
                error.message || 'Error al obtener productos más vendidos'
            );
        }
    }

    async getSalesByCategory() {
        try {
            const salesByCategory = await this.saleItemsRepository
                .createQueryBuilder('saleItem')
                .leftJoin('saleItem.product', 'product')
                .leftJoin('product.category', 'category')
                .select('category.name', 'category')
                .addSelect('SUM(saleItem.quantity * saleItem.unitPrice)', 'total')
                .where('category.name IS NOT NULL')
                .groupBy('category.name')
                .getRawMany();

            const totalRevenue = salesByCategory.reduce(
                (sum, s) => sum + parseFloat(s.total),
                0,
            );

            return salesByCategory.map((s) => ({
                category: s.category || 'Sin categoría',
                total: parseFloat(s.total),
                percentage: ((parseFloat(s.total) / totalRevenue) * 100).toFixed(2),
            }));
        } catch (error) {
            console.error('Error completo en getSalesByCategory:', JSON.stringify(error, null, 2));
            console.error('Stack:', error.stack);
            throw new InternalServerErrorException(
                error.message || 'Error al obtener ventas por categoría'
            );
        }
    }

    async getRecentSales(limit: number = 10) {
        try {
            const sales = await this.salesRepository.find({
                relations: ['customer', 'user'],
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
