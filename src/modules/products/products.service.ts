import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductType } from '../../database/entities/product.entity';
import { ResourceNotFoundException, ConflictException, BusinessLogicException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        // Verificar si el barcode ya existe (si se proporciona)
        if (createProductDto.barcode) {
            const existingProduct = await this.productsRepository.findOne({
                where: { barcode: createProductDto.barcode },
            });

            if (existingProduct) {
                throw ConflictException.duplicateResource('Product', 'barcode', createProductDto.barcode);
            }
        }

        // Verificar si el SKU ya existe (si se proporciona)
        if (createProductDto.sku) {
            const existingProduct = await this.productsRepository.findOne({
                where: { sku: createProductDto.sku },
            });

            if (existingProduct) {
                throw ConflictException.duplicateResource('Product', 'sku', createProductDto.sku);
            }
        }

        const product = this.productsRepository.create({
            ...createProductDto,
            type: createProductDto.type ?? ProductType.PHYSICAL,
            minStock: createProductDto.minStock ?? 0,
            isActive: createProductDto.isActive ?? true,
        });

        return this.productsRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return this.productsRepository.find({
            relations: ['category', 'brand'],
            order: { name: 'ASC' },
        });
    }

    async findByCategory(categoryId: string): Promise<Product[]> {
        return this.productsRepository.find({
            where: { categoryId },
            relations: ['category', 'brand'],
            order: { name: 'ASC' },
        });
    }

    async findByBrand(brandId: string): Promise<Product[]> {
        return this.productsRepository.find({
            where: { brandId },
            relations: ['category', 'brand'],
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['category', 'brand'],
        });

        if (!product) {
            throw ResourceNotFoundException.product(id);
        }

        return product;
    }

    async findLowStock(): Promise<Product[]> {
        return this.productsRepository
            .createQueryBuilder('product')
            .where('product.stock <= product.minStock')
            .andWhere('product.type = :type', { type: ProductType.PHYSICAL })
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.brand', 'brand')
            .orderBy('product.stock', 'ASC')
            .getMany();
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);

        // Si se está actualizando el barcode, verificar que no exista
        if (updateProductDto.barcode && updateProductDto.barcode !== product.barcode) {
            const existingProduct = await this.productsRepository.findOne({
                where: { barcode: updateProductDto.barcode },
            });

            if (existingProduct) {
                throw ConflictException.duplicateResource('Product', 'barcode', updateProductDto.barcode);
            }
        }

        // Si se está actualizando el SKU, verificar que no exista
        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            const existingProduct = await this.productsRepository.findOne({
                where: { sku: updateProductDto.sku },
            });

            if (existingProduct) {
                throw ConflictException.duplicateResource('Product', 'sku', updateProductDto.sku);
            }
        }

        Object.assign(product, updateProductDto);
        return this.productsRepository.save(product);
    }

    async updateStock(id: string, quantity: number): Promise<Product> {
        const product = await this.findOne(id);

        if (product.type === ProductType.SERVICE) {
            throw new BusinessLogicException('No se puede actualizar el stock de un servicio');
        }

        const newStock = product.stock + quantity;

        if (newStock < 0) {
            throw new BusinessLogicException(
                `Stock insuficiente. Stock actual: ${product.stock}, cantidad solicitada: ${Math.abs(quantity)}`,
            );
        }

        product.stock = newStock;
        return this.productsRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        const product = await this.findOne(id);
        await this.productsRepository.softDelete(id);
    }
}
