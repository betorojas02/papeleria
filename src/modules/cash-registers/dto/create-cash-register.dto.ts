import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum CashRegisterStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

export class CreateCashRegisterDto {
    @ApiProperty({
        description: 'Opening amount',
        example: 50000,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    openingAmount: number;

    @ApiProperty({
        description: 'User ID who opens the register',
        example: 'uuid',
    })
    @IsUUID()
    @IsNotEmpty()
    userId: string;
}

export class CloseCashRegisterDto {
    @ApiProperty({
        description: 'Closing amount',
        example: 150000,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    closingAmount: number;
}
