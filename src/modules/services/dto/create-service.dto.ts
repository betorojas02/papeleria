import { IsString, IsNumber, IsBoolean, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
    @ApiProperty({ example: 'Fotocopia B/N', description: 'Service name' })
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'Fotocopia blanco y negro', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 100, description: 'Service price' })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
