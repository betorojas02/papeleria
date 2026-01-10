import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from '../../database/entities/supplier.entity';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class SuppliersService {
    constructor(
        @InjectRepository(Supplier)
        private readonly suppliersRepository: Repository<Supplier>,
    ) { }

    async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
        // Verificar si el taxId ya existe
        const existingSupplier = await this.suppliersRepository.findOne({
            where: { taxId: createSupplierDto.taxId },
        });

        if (existingSupplier) {
            throw ConflictException.duplicateResource('Supplier', 'taxId', createSupplierDto.taxId);
        }

        const supplier = this.suppliersRepository.create({
            ...createSupplierDto,
            isActive: createSupplierDto.isActive ?? true,
        });

        return this.suppliersRepository.save(supplier);
    }

    async findAll(): Promise<Supplier[]> {
        return this.suppliersRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Supplier> {
        const supplier = await this.suppliersRepository.findOne({ where: { id } });

        if (!supplier) {
            throw ResourceNotFoundException.supplier(id);
        }

        return supplier;
    }

    async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
        const supplier = await this.findOne(id);

        // Si se está actualizando el taxId, verificar que no exista
        if (updateSupplierDto.taxId && updateSupplierDto.taxId !== supplier.taxId) {
            const existingSupplier = await this.suppliersRepository.findOne({
                where: { taxId: updateSupplierDto.taxId },
            });

            if (existingSupplier) {
                throw ConflictException.duplicateResource('Supplier', 'taxId', updateSupplierDto.taxId);
            }
        }

        Object.assign(supplier, updateSupplierDto);
        return this.suppliersRepository.save(supplier);
    }

    async remove(id: string): Promise<void> {
        const supplier = await this.findOne(id);
        await this.suppliersRepository.softDelete(id);
    }
}
