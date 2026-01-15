import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
    @ApiProperty({
        description: 'Supplier name',
        example: 'Distribuidora Escolar S.A.S',
    })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @ApiProperty({
        description: 'Tax ID (NIT)',
        example: '900123456-7',
    })
    @IsString({ message: 'El RUC/DNI debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El RUC/DNI es obligatorio' })
    taxId: string;

    @ApiProperty({
        description: 'Supplier email',
        example: 'ventas@distribuidora.com',
        required: false,
    })
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Supplier phone',
        example: '+57 300 1234567',
        required: false,
    })
    @IsString({ message: 'El teléfono debe ser una cadena de texto' })
    @IsOptional()
    phone?: string;

    @ApiProperty({
        description: 'Supplier address',
        example: 'Calle 123 #45-67, Bogotá',
        required: false,
    })
    @IsString({ message: 'La dirección debe ser una cadena de texto' })
    @IsOptional()
    address?: string;

    @ApiProperty({
        description: 'Supplier active status',
        example: true,
        required: false,
        default: true,
    })
    @IsBoolean({ message: 'El estado debe ser booleano' })
    @IsOptional()
    isActive?: boolean;
}
