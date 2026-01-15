
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sale } from './database/entities/sale.entity';
import { SalePayment } from './database/entities/sale-payment.entity';
import { CashRegister, CashRegisterStatus } from './database/entities/cash-register.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    console.log('--- DEBUG START ---');

    // 1. Get Open Registers
    const openRegisters = await dataSource.getRepository(CashRegister).find({
        where: { status: CashRegisterStatus.OPEN }
    });
    console.log(`Open Registers Found: ${openRegisters.length}`);
    openRegisters.forEach(r => {
        console.log(`- Register ID: ${r.id}, Opening: ${r.openingAmount}, User: ${r.userId}`);
    });

    if (openRegisters.length === 0) {
        console.log('No open registers. Cannot debug further.');
        await app.close();
        return;
    }
    const registerId = openRegisters[0].id;

    // 2. Get Last 5 Sales
    const sales = await dataSource.getRepository(Sale).find({
        order: { createdAt: 'DESC' },
        take: 5,
        relations: ['payments']
    });

    console.log(`\nLast 5 Sales:`);
    sales.forEach(s => {
        console.log(`- Sale ID: ${s.id}, Total: ${s.total}, RegisterID: ${s.cashRegisterId} (Match Open: ${s.cashRegisterId === registerId})`);
        s.payments.forEach(p => {
            console.log(`  > Payment: ${p.amount}, Method: '${p.paymentMethod}'`);
        });
    });

    // 3. Test the calculation query manually
    const { total } = await dataSource.manager
        .createQueryBuilder(SalePayment, 'sp')
        .innerJoin('sp.sale', 's')
        .where('s.cashRegisterId = :registerId', { registerId })
        .andWhere('sp.paymentMethod = :method', { method: 'cash' })
        .select('SUM(sp.amount)', 'total')
        .getRawOne();

    console.log(`\nManual Query Result for Register ${registerId}: ${total}`);

    console.log('--- DEBUG END ---');
    await app.close();
}

bootstrap();
