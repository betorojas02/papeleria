import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CustomerDto {
    @Expose()
    id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;
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

class SaleItemResponseDto {
    @Expose()
    id: string;

    @Expose()
    quantity: number;

    @Expose()
    price: number;

    @Expose()
    subtotal: number;

    @Expose()
    @Type(() => ProductDto)
    product: ProductDto;
}

class SalePaymentResponseDto {
    @Expose()
    id: string;

    @Expose()
    paymentMethod: string;

    @Expose()
    amount: number;

    @Expose()
    voucherNumber: string;

    @Expose()
    referenceNumber: string;
}

export class SaleResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    total: number;

    @ApiProperty()
    @Expose()
    taxAmount: number;

    @ApiProperty()
    @Expose()
    invoiceNumber: string;

    @ApiProperty({ type: CustomerDto })
    @Expose()
    @Type(() => CustomerDto)
    customer: CustomerDto;

    @ApiProperty({ type: UserDto })
    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @ApiProperty({ type: [SaleItemResponseDto] })
    @Expose()
    @Type(() => SaleItemResponseDto)
    items: SaleItemResponseDto[];

    @ApiProperty({ type: [SalePaymentResponseDto] })
    @Expose()
    @Type(() => SalePaymentResponseDto)
    payments: SalePaymentResponseDto[];

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
