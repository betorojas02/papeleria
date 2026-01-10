import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../../database/entities/category.entity';
import { ResourceNotFoundException } from '../../common/exceptions/custom.exceptions';
import { ConflictException as CustomConflictException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        // Verificar si el nombre ya existe
        const existingCategory = await this.categoriesRepository.findOne({
            where: { name: createCategoryDto.name },
        });

        if (existingCategory) {
            throw CustomConflictException.duplicateResource('Category', 'name', createCategoryDto.name);
        }

        const category = this.categoriesRepository.create({
            ...createCategoryDto,
            isActive: createCategoryDto.isActive ?? true,
        });

        return this.categoriesRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({ where: { id } });

        if (!category) {
            throw ResourceNotFoundException.category(id);
        }

        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        // Si se está actualizando el nombre, verificar que no exista
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existingCategory = await this.categoriesRepository.findOne({
                where: { name: updateCategoryDto.name },
            });

            if (existingCategory) {
                throw CustomConflictException.duplicateResource('Category', 'name', updateCategoryDto.name);
            }
        }

        Object.assign(category, updateCategoryDto);
        return this.categoriesRepository.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.findOne(id);
        await this.categoriesRepository.softDelete(id);
    }
}
