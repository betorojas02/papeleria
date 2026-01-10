import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
    IsBoolean,
    IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/decorators/roles.decorator';

export class CreateUserDto {
    @ApiProperty({ example: 'Juan' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Pérez' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'juan.perez@papeleria.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
    @IsEnum(UserRole)
    role: UserRole;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
