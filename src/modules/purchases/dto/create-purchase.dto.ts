import { IsNotEmpty, IsNumber, IsUUID, IsArray, ValidateNested, Min, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PurchaseDetailDto {
    @ApiProperty({
        description: 'Product ID',
        example: 'uuid',
    })
    @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El producto es obligatorio' })
    productId: string;

    @ApiProperty({
        description: 'Quantity purchased',
        example: 50,
    })
    @IsNumber({}, { message: 'La cantidad debe ser un número' })
    @Min(1, { message: 'La cantidad mínima es 1' })
    @Type(() => Number)
    quantity: number;

    @ApiProperty({
        description: 'Unit cost',
        example: 3000,
    })
    @IsNumber({}, { message: 'El costo unitario debe ser un número' })
    @Min(0, { message: 'El costo no puede ser negativo' })
    @Type(() => Number)
    unitCost: number;
}

export class CreatePurchaseDto {
    @ApiProperty({
        description: 'Supplier ID',
        example: 'uuid',
    })
    @IsUUID('4', { message: 'El ID del proveedor debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El proveedor es obligatorio' })
    supplierId: string;

    @ApiProperty({
        description: 'User ID who registers the purchase',
        example: 'uuid',
    })
    @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El usuario es obligatorio' })
    userId: string;

    @ApiProperty({
        description: 'Invoice number',
        example: 'FAC-001',
        required: false,
    })
    @IsString({ message: 'El número de factura debe ser texto' })
    @IsOptional()
    invoiceNumber?: string;

    @ApiProperty({
        description: 'Purchase details',
        type: [PurchaseDetailDto],
    })
    @IsArray({ message: 'Los detalles deben ser una lista' })
    @ValidateNested({ each: true })
    @Type(() => PurchaseDetailDto)
    details: PurchaseDetailDto[];
}
