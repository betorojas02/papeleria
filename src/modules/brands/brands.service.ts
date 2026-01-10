import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from '../../database/entities/brand.entity';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class BrandsService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandsRepository: Repository<Brand>,
    ) { }

    async create(createBrandDto: CreateBrandDto): Promise<Brand> {
        // Verificar si el nombre ya existe
        const existingBrand = await this.brandsRepository.findOne({
            where: { name: createBrandDto.name },
        });

        if (existingBrand) {
            throw ConflictException.duplicateResource('Brand', 'name', createBrandDto.name);
        }

        const brand = this.brandsRepository.create({
            ...createBrandDto,
            isActive: createBrandDto.isActive ?? true,
        });

        return this.brandsRepository.save(brand);
    }

    async findAll(): Promise<Brand[]> {
        return this.brandsRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Brand> {
        const brand = await this.brandsRepository.findOne({ where: { id } });

        if (!brand) {
            throw ResourceNotFoundException.model('Brand', id);
        }

        return brand;
    }

    async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
        const brand = await this.findOne(id);

        // Si se está actualizando el nombre, verificar que no exista
        if (updateBrandDto.name && updateBrandDto.name !== brand.name) {
            const existingBrand = await this.brandsRepository.findOne({
                where: { name: updateBrandDto.name },
            });

            if (existingBrand) {
                throw ConflictException.duplicateResource('Brand', 'name', updateBrandDto.name);
            }
        }

        Object.assign(brand, updateBrandDto);
        return this.brandsRepository.save(brand);
    }

    async remove(id: string): Promise<void> {
        const brand = await this.findOne(id);
        await this.brandsRepository.softDelete(id);
    }
}
