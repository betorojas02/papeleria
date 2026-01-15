import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCashRegisterDto, CloseCashRegisterDto, CashRegisterStatus } from './dto/create-cash-register.dto';
import { UpdateCashRegisterDto } from './dto/update-cash-register.dto';
import { CashRegister } from '../../database/entities/cash-register.entity';
import { SalePayment } from '../../database/entities/sale-payment.entity';
import { ResourceNotFoundException, BusinessLogicException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class CashRegistersService {
    constructor(
        @InjectRepository(CashRegister)
        private readonly cashRegistersRepository: Repository<CashRegister>,
        @InjectRepository(SalePayment)
        private readonly salePaymentsRepository: Repository<SalePayment>,
    ) { }

    async open(createCashRegisterDto: CreateCashRegisterDto): Promise<CashRegister> {
        // Verificar si hay una caja abierta para este usuario
        const openRegister = await this.cashRegistersRepository.findOne({
            where: {
                userId: createCashRegisterDto.userId,
                status: CashRegisterStatus.OPEN,
            },
        });

        if (openRegister) {
            throw new BusinessLogicException(
                'Ya existe una caja abierta para este usuario. Debe cerrarla antes de abrir una nueva.',
            );
        }

        const cashRegister = this.cashRegistersRepository.create({
            ...createCashRegisterDto,
            status: CashRegisterStatus.OPEN,
            openedAt: new Date(),
        });

        return this.cashRegistersRepository.save(cashRegister);
    }

    async close(id: string, closeCashRegisterDto: CloseCashRegisterDto): Promise<CashRegister> {
        const cashRegister = await this.findOne(id);

        if (cashRegister.status === CashRegisterStatus.CLOSED) {
            throw new BusinessLogicException('Esta caja ya está cerrada.');
        }

        cashRegister.closingAmount = closeCashRegisterDto.closingAmount;
        cashRegister.status = CashRegisterStatus.CLOSED;
        cashRegister.closedAt = new Date();

        return this.cashRegistersRepository.save(cashRegister);
    }

    async findAll(): Promise<CashRegister[]> {
        return this.cashRegistersRepository.find({
            relations: ['user'],
            order: { openedAt: 'DESC' },
        });
    }

    async findOpen(): Promise<any[]> {
        const registers = await this.cashRegistersRepository.find({
            where: { status: CashRegisterStatus.OPEN },
            relations: ['user'],
            order: { openedAt: 'DESC' },
        });

        // Calculate totals for each open register
        const registersWithStats = await Promise.all(registers.map(async (register) => {
            const { total } = await this.salePaymentsRepository
                .createQueryBuilder('sp')
                .innerJoin('sp.sale', 's')
                .where('s.cashRegisterId = :registerId', { registerId: register.id })
                .andWhere('sp.paymentMethod = :method', { method: 'cash' })
                .select('SUM(sp.amount)', 'total')
                .getRawOne();

            console.log(`[CashRegister Debug] Register: ${register.id}, Total Sales: ${total}, Method: cash`);

            const totalCashSales = parseFloat(total || '0');
            const openingAmount = parseFloat(register.openingAmount as any);

            return {
                ...register,
                totalCashSales,
                currentBalance: openingAmount + totalCashSales
            };
        }));

        return registersWithStats;
    }

    async findOne(id: string): Promise<CashRegister> {
        const cashRegister = await this.cashRegistersRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!cashRegister) {
            throw ResourceNotFoundException.model('CashRegister', id);
        }

        return cashRegister;
    }

    async remove(id: string): Promise<void> {
        const cashRegister = await this.findOne(id);

        if (cashRegister.status === CashRegisterStatus.OPEN) {
            throw new BusinessLogicException('No se puede eliminar una caja abierta. Debe cerrarla primero.');
        }

        await this.cashRegistersRepository.softDelete(id);
    }
}
