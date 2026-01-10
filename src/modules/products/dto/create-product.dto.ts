import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsEnum, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductType } from '../../../database/entities/product.entity';

export class CreateProductDto {
    @ApiProperty({
        description: 'Product name',
        example: 'Cuaderno Norma 100 hojas',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Cuaderno de 100 hojas cuadriculado',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Product price',
        example: 5000,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @ApiProperty({
        description: 'Product stock quantity',
        example: 50,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    stock: number;

    @ApiProperty({
        description: 'Minimum stock level for alerts',
        example: 10,
        required: false,
        default: 0,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    @IsOptional()
    minStock?: number;

    @ApiProperty({
        description: 'Product barcode',
        example: '7701234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    barcode?: string;

    @ApiProperty({
        description: 'Product SKU (Stock Keeping Unit)',
        example: 'CUAD-NORMA-100',
        required: false,
    })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiProperty({
        description: 'Product type',
        enum: ProductType,
        example: ProductType.PHYSICAL,
        default: ProductType.PHYSICAL,
    })
    @IsEnum(ProductType)
    @IsOptional()
    type?: ProductType;

    @ApiProperty({
        description: 'Category ID',
        example: 'uuid',
    })
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({
        description: 'Brand ID',
        example: 'uuid',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    brandId?: string;

    @ApiProperty({
        description: 'Product active status',
        example: true,
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
