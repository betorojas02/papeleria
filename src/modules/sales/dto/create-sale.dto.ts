import { IsNotEmpty, IsNumber, IsUUID, IsArray, ValidateNested, Min, IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../../database/entities/sale-payment.entity';

export class SaleItemDto {
    @ApiProperty({
        description: 'Item type: product or service',
        enum: ['product', 'service'],
        example: 'product',
        default: 'product',
    })
    @IsEnum(['product', 'service'])
    @IsOptional()
    itemType?: 'product' | 'service';

    @ApiProperty({
        description: 'Product ID (required if itemType is product)',
        example: 'uuid',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    productId?: string;

    @ApiProperty({
        description: 'Service ID (required if itemType is service)',
        example: 'uuid',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    serviceId?: string;

    @ApiProperty({
        description: 'Quantity sold',
        example: 2,
    })
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    quantity: number;

    @ApiProperty({
        description: 'Unit price',
        example: 5000,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;
}

export class SalePaymentDto {
    @ApiProperty({
        description: 'Payment method',
        enum: PaymentMethod,
        example: PaymentMethod.CASH,
    })
    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    method: PaymentMethod;

    @ApiProperty({
        description: 'Payment amount',
        example: 10000,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    amount: number;

    @ApiProperty({
        description: 'Voucher number (for card/transfer)',
        example: '123456',
        required: false,
    })
    @IsString()
    @IsOptional()
    voucherNumber?: string;

    @ApiProperty({
        description: 'Reference number (for transfer)',
        example: 'REF-001',
        required: false,
    })
    @IsString()
    @IsOptional()
    referenceNumber?: string;
}

export class CreateSaleDto {
    @ApiProperty({
        description: 'Customer ID',
        example: 'uuid',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    customerId?: string;

    @ApiProperty({
        description: 'User ID who registers the sale',
        example: 'uuid',
    })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: 'Cash register ID',
        example: 'uuid',
    })
    @IsUUID()
    @IsNotEmpty()
    cashRegisterId: string;

    @ApiProperty({
        description: 'Invoice number',
        example: 'INV-001',
        required: false,
    })
    @IsString()
    @IsOptional()
    invoiceNumber?: string;

    @ApiProperty({
        description: 'Tax amount',
        example: 1900,
        required: false,
        default: 0,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    @IsOptional()
    taxAmount?: number;

    @ApiProperty({
        description: 'Sale items',
        type: [SaleItemDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaleItemDto)
    items: SaleItemDto[];

    @ApiProperty({
        description: 'Payment methods',
        type: [SalePaymentDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SalePaymentDto)
    payments: SalePaymentDto[];
}
