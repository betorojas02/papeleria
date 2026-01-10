import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DocumentType {
    CC = 'CC',
    CE = 'CE',
    NIT = 'NIT',
    PASSPORT = 'PASSPORT',
}

export class CreateCustomerDto {
    @ApiProperty({
        description: 'Customer first name',
        example: 'Juan',
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: 'Customer last name',
        example: 'Pérez',
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'Customer email',
        example: 'juan.perez@example.com',
        required: false,
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Customer phone',
        example: '+57 300 1234567',
        required: false,
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({
        description: 'Customer address',
        example: 'Calle 123 #45-67',
        required: false,
    })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({
        description: 'Document number',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    documentNumber?: string;

    @ApiProperty({
        description: 'Document type',
        enum: DocumentType,
        example: DocumentType.CC,
        required: false,
    })
    @IsEnum(DocumentType)
    @IsOptional()
    documentType?: DocumentType;

    @ApiProperty({
        description: 'Customer active status',
        example: true,
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
