import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Category name',
        example: 'Cuadernos',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Category description',
        example: 'Cuadernos de diferentes tamaños y tipos',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Category active status',
        example: true,
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
