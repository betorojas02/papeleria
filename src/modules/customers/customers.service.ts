import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '../../database/entities/customer.entity';
import { ResourceNotFoundException, ConflictException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customersRepository: Repository<Customer>,
    ) { }

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        // Verificar si el email ya existe (si se proporciona)
        if (createCustomerDto.email) {
            const existingCustomer = await this.customersRepository.findOne({
                where: { email: createCustomerDto.email },
            });

            if (existingCustomer) {
                throw ConflictException.duplicateResource('Customer', 'email', createCustomerDto.email);
            }
        }

        const customer = this.customersRepository.create({
            ...createCustomerDto,
            isActive: createCustomerDto.isActive ?? true,
        });

        return this.customersRepository.save(customer);
    }

    async findAll(): Promise<Customer[]> {
        return this.customersRepository.find({
            order: { firstName: 'ASC', lastName: 'ASC' },
        });
    }

    async search(query: string): Promise<Customer[]> {
        return this.customersRepository.createQueryBuilder('customer')
            .where(new Brackets(qb => {
                qb.where('LOWER(customer.firstName) LIKE LOWER(:query)', { query: `%${query}%` })
                    .orWhere('LOWER(customer.lastName) LIKE LOWER(:query)', { query: `%${query}%` })
                    .orWhere('LOWER(customer.documentNumber) LIKE LOWER(:query)', { query: `%${query}%` });
            }))
            .orderBy('customer.firstName', 'ASC')
            .addOrderBy('customer.lastName', 'ASC')
            .getMany();
    }

    async findOne(id: string): Promise<Customer> {
        const customer = await this.customersRepository.findOne({ where: { id } });

        if (!customer) {
            throw ResourceNotFoundException.customer(id);
        }

        return customer;
    }

    async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
        const customer = await this.findOne(id);

        // Si se está actualizando el email, verificar que no exista
        if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
            const existingCustomer = await this.customersRepository.findOne({
                where: { email: updateCustomerDto.email },
            });

            if (existingCustomer) {
                throw ConflictException.duplicateResource('Customer', 'email', updateCustomerDto.email);
            }
        }

        Object.assign(customer, updateCustomerDto);
        return this.customersRepository.save(customer);
    }

    async remove(id: string): Promise<void> {
        const customer = await this.findOne(id);
        await this.customersRepository.softDelete(id);
    }
}
