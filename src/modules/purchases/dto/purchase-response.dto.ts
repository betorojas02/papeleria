import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SupplierDto {
    @Expose()
    id: string;

    @Expose()
    name: string;
}

class UserDto {
    @Expose()
    id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;
}

class ProductDto {
    @Expose()
    id: string;

    @Expose()
    name: string;
}

class PurchaseDetailResponseDto {
    @Expose()
    id: string;

    @Expose()
    quantity: number;

    @Expose()
    unitCost: number;

    @Expose()
    subtotal: number;

    @Expose()
    @Type(() => ProductDto)
    product: ProductDto;
}

export class PurchaseResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    invoiceNumber: string;

    @ApiProperty()
    @Expose()
    total: number;

    @ApiProperty()
    @Expose()
    purchaseDate: Date;

    @ApiProperty({ type: SupplierDto })
    @Expose()
    @Type(() => SupplierDto)
    supplier: SupplierDto;

    @ApiProperty({ type: UserDto })
    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @ApiProperty({ type: [PurchaseDetailResponseDto] })
    @Expose()
    @Type(() => PurchaseDetailResponseDto)
    details: PurchaseDetailResponseDto[];

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
