import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResourceNotFoundException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Verificar si el email ya existe
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        // Crear usuario
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        return await this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) {
            throw ResourceNotFoundException.user(id);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'isActive'],
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        // Si se actualiza el email, verificar que no exista
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateUserDto.email },
            });

            if (existingUser) {
                throw new ConflictException('Email already exists');
            }
        }

        // Si se actualiza la contraseña, hashearla
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(user, updateUserDto);
        return await this.usersRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.softDelete(id);
    }
}
