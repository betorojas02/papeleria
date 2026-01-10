import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
    @ApiProperty({
        description: 'Supplier name',
        example: 'Distribuidora Escolar S.A.S',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Tax ID (NIT)',
        example: '900123456-7',
    })
    @IsString()
    @IsNotEmpty()
    taxId: string;

    @ApiProperty({
        description: 'Supplier email',
        example: 'ventas@distribuidora.com',
        required: false,
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Supplier phone',
        example: '+57 300 1234567',
        required: false,
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({
        description: 'Supplier address',
        example: 'Calle 123 #45-67, Bogotá',
        required: false,
    })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({
        description: 'Supplier active status',
        example: true,
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
