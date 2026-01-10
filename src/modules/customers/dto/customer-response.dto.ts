import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    firstName: string;

    @ApiProperty()
    @Expose()
    lastName: string;

    @ApiProperty()
    @Expose()
    email: string;

    @ApiProperty()
    @Expose()
    phone: string;

    @ApiProperty()
    @Expose()
    address: string;

    @ApiProperty()
    @Expose()
    documentNumber: string;

    @ApiProperty()
    @Expose()
    documentType: string;

    @ApiProperty()
    @Expose()
    isActive: boolean;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
