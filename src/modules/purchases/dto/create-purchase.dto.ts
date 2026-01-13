import { IsNotEmpty, IsNumber, IsUUID, IsArray, ValidateNested, Min, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PurchaseDetailDto {
    @ApiProperty({
        description: 'Product ID',
        example: 'uuid',
    })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({
        description: 'Quantity purchased',
        example: 50,
    })
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    quantity: number;

    @ApiProperty({
        description: 'Unit cost',
        example: 3000,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    unitCost: number;
}

export class CreatePurchaseDto {
    @ApiProperty({
        description: 'Supplier ID',
        example: 'uuid',
    })
    @IsUUID()
    @IsNotEmpty()
    supplierId: string;

    @ApiProperty({
        description: 'User ID who registers the purchase',
        example: 'uuid',
    })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: 'Invoice number',
        example: 'FAC-001',
        required: false,
    })
    @IsString()
    @IsOptional()
    invoiceNumber?: string;

    @ApiProperty({
        description: 'Purchase details',
        type: [PurchaseDetailDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PurchaseDetailDto)
    details: PurchaseDetailDto[];
}
