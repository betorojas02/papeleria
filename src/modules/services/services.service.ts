import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from '../../database/entities/service.entity';
import { ResourceNotFoundException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private readonly servicesRepository: Repository<Service>,
    ) { }

    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        const service = this.servicesRepository.create(createServiceDto);
        return await this.servicesRepository.save(service);
    }

    async findAll(): Promise<Service[]> {
        return await this.servicesRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Service> {
        const service = await this.servicesRepository.findOne({
            where: { id },
        });

        if (!service) {
            throw ResourceNotFoundException.model('Service', id);
        }

        return service;
    }

    async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
        const service = await this.findOne(id);
        Object.assign(service, updateServiceDto);
        return await this.servicesRepository.save(service);
    }

    async remove(id: string): Promise<void> {
        const service = await this.findOne(id);
        await this.servicesRepository.softDelete(id);
    }
}
