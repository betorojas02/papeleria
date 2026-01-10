import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CategoryDto {
    @Expose()
    id: string;

    @Expose()
    name: string;
}

class BrandDto {
    @Expose()
    id: string;

    @Expose()
    name: string;
}

export class ProductResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty()
    @Expose()
    price: number;

    @ApiProperty()
    @Expose()
    stock: number;

    @ApiProperty()
    @Expose()
    minStock: number;

    @ApiProperty()
    @Expose()
    barcode: string;

    @ApiProperty()
    @Expose()
    sku: string;

    @ApiProperty()
    @Expose()
    type: string;

    @ApiProperty()
    @Expose()
    isActive: boolean;

    @ApiProperty({ type: CategoryDto })
    @Expose()
    @Type(() => CategoryDto)
    category: CategoryDto;

    @ApiProperty({ type: BrandDto })
    @Expose()
    @Type(() => BrandDto)
    brand: BrandDto;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
